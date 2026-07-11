<?php

namespace App\Console\Commands;

use App\Services\AdminReportService;
use Illuminate\Console\Command;

class EvaluateForecastModels extends Command
{
    protected $signature = 'dss:evaluate-models
                            {--trend_months=12 : Number of months of history to use}
                            {--revenue_forecast_horizon=3 : Months ahead to forecast revenue}
                            {--pax_sma_window=3 : SMA window size (months)}
                            {--pax_projection_horizon=3 : Months ahead to project pax demand}';

    protected $description = 'Evaluate the DSS forecasting models (SLR & SMA) and display RMSE, MAE, and R² metrics in the terminal.';

    public function handle(AdminReportService $service): int
    {
        $this->printBanner();

        $filters = [
            'trend_months'              => (int) $this->option('trend_months'),
            'revenue_forecast_horizon'  => (int) $this->option('revenue_forecast_horizon'),
            'pax_sma_window'            => (int) $this->option('pax_sma_window'),
            'pax_projection_horizon'    => (int) $this->option('pax_projection_horizon'),
        ];

        $this->line('');
        $this->line('  <fg=cyan>Parameters used:</>');
        $this->line("    Trend window       : <fg=yellow>{$filters['trend_months']} months</>");
        $this->line("    Revenue horizon    : <fg=yellow>{$filters['revenue_forecast_horizon']} months ahead</>");
        $this->line("    SMA window         : <fg=yellow>{$filters['pax_sma_window']}-period</>");
        $this->line("    Pax horizon        : <fg=yellow>{$filters['pax_projection_horizon']} months ahead</>");
        $this->line('');

        $this->line('  <fg=cyan>Fetching analytics forecasts ...</>');
        $payload = $service->analyticsForecasts($filters);

        $revenue = $payload['revenueRegression'] ?? [];
        $demand  = $payload['demandMovingAverage'] ?? [];

        // ── Revenue SLR ──────────────────────────────────────────────────────────
        $this->printSectionHeader('1. Revenue Forecast — Simple Linear Regression (80/20 Train-Test Split)');
        $this->printRevenueEvaluation($revenue);

        // ── Pax SMA ──────────────────────────────────────────────────────────────
        $this->printSectionHeader('2. Pax Demand Forecast — Simple Moving Average (Avg Pax Per Booking)');
        $this->printPaxEvaluation($demand);

        $this->printFooter();

        return self::SUCCESS;
    }

    // ── Revenue SLR section ───────────────────────────────────────────────────

    private function printRevenueEvaluation(array $revenue): void
    {
        $insuff = $revenue['is_insufficient_data'] ?? true;
        $eval   = $revenue['evaluation'] ?? [];

        $this->line('');
        $this->printKV('Method',      $revenue['method'] ?? 'Simple Linear Regression (OLS)');
        $this->printKV('Formula',     $revenue['formula'] ?? 'Y = a + bX');
        $this->printKV('Sample size', (string) ($revenue['sampleSize'] ?? 0).' data points');

        if ($insuff) {
            $this->line('');
            $this->warn('  ⚠  Insufficient historical data — Metrics cannot be computed yet.');
            $this->line('     '.$this->quote($eval['interpretation'] ?? ''));
            $this->line('');
            return;
        }

        // Model parameters
        $this->line('');
        $this->line('  <fg=cyan>Model Parameters</>');
        $this->printKV('Intercept (α)',  $this->fmt($revenue['alpha'] ?? null));
        $this->printKV('Slope (β)',      $this->fmt($revenue['beta'] ?? null));
        $this->printKV('Direction',      $revenue['summary']['direction'] ?? '—');
        $this->printKV('Next forecast',  $this->peso($revenue['summary']['nextForecast'] ?? 0));

        // Evaluation CV Info
        $this->line('');
        $this->line('  <fg=cyan>80/20 Chronological Train-Test Split</>');
        $this->printKV('Train size',         (string) ($eval['trainSize'] ?? 0).' periods');
        $this->printKV('Test size',          (string) ($eval['testSize'] ?? 0).' periods');

        // ─── Metrics table ───────────────────────────────────────────────────
        $this->line('');
        $this->line('  <fg=cyan>Test Set Metrics</>');

        $rmse = $eval['rmse'] ?? null;
        $mae  = $eval['mae']  ?? null;
        $r2   = $eval['r2']   ?? null;

        $rows = [
            ['Metric', 'Value', 'Meaning'],
            ['RMSE',
                $rmse !== null ? 'PHP '.number_format((float) $rmse, 2) : 'N/A',
                'Avg error on test set (cumulative revenue)'],
            ['MAE',
                $mae !== null  ? 'PHP '.number_format((float) $mae,  2) : 'N/A',
                'Avg absolute error on test set'],
            ['R²  (R-squared)',
                $r2  !== null  ? number_format((float) $r2,  4) : 'N/A',
                'Goodness-of-fit on test set'],
        ];

        $this->table($rows[0], array_slice($rows, 1));

        // Verdict
        $this->printVerdict('Revenue SLR', $rmse, $mae, $r2);

        $this->line('');
        $this->line('  <fg=gray>'.$this->quote($eval['interpretation'] ?? '').'</>');
        $this->line('');
    }

    // ── Pax SMA section ──────────────────────────────────────────────────────

    private function printPaxEvaluation(array $demand): void
    {
        $insuff = $demand['is_insufficient_data'] ?? true;
        $eval   = $demand['evaluation'] ?? [];

        $this->line('');
        $this->printKV('Method',      $demand['method'] ?? 'Simple Moving Average (SMA)');
        $this->printKV('SMA window',  ($eval['window'] ?? $demand['smaWindow'] ?? '—').' period(s)');
        $this->printKV('Avg Pax/Bkg', number_format((float) ($demand['avgPaxPerBooking'] ?? 0), 2));

        if ($insuff) {
            $this->line('');
            $this->warn('  ⚠  Insufficient historical data — Metrics cannot be computed.');
            $this->line('');
            return;
        }

        // Summary
        $this->line('');
        $this->line('  <fg=cyan>Projection Summary</>');
        $this->printKV('Next forecast',  number_format((float) ($demand['summary']['nextForecast'] ?? 0), 1).' guests');
        $this->printKV('Peak period',    $demand['summary']['peakPeriod'] ?? '—');

        // ─── Metrics table ───────────────────────────────────────────────────
        $this->line('');
        $this->line('  <fg=cyan>Test Set Metrics</>');

        $rmse = $eval['rmse'] ?? null;
        $mae  = $eval['mae']  ?? null;

        $rows = [
            ['Metric', 'Value', 'Meaning'],
            ['RMSE',
                $rmse !== null ? number_format((float) $rmse, 2).' guests' : 'N/A',
                'Root mean square error on test set'],
            ['MAE',
                $mae !== null  ? number_format((float) $mae,  2).' guests' : 'N/A',
                'Mean absolute error on test set'],
        ];

        $this->table($rows[0], array_slice($rows, 1));

        // Verdict
        $this->printPaxVerdict('Pax SMA', $rmse, $mae);

        $this->line('');
        $this->line('  <fg=gray>'.$this->quote($eval['interpretation'] ?? '').'</>');
        $this->line('');
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private function printBanner(): void
    {
        $this->line('');
        $this->line('  <fg=white;bg=blue;options=bold> DSS FORECASTING MODEL EVALUATION </> ');
        $this->line('  ════════════════════════════════════════════════════════════════════');
        $this->line('  Evaluates the trained SLR (revenue) and SMA (pax demand) models    ');
        $this->line('  using 80/20 Chronological Train-Test Split.                         ');
        $this->line('  ════════════════════════════════════════════════════════════════════');
    }

    private function printSectionHeader(string $title): void
    {
        $this->line('');
        $this->line("  <fg=white;options=bold>┌─ {$title}</>");
        $this->line('  └' . str_repeat('─', strlen($title) + 3));
    }

    private function printKV(string $label, string $value): void
    {
        $pad = str_pad($label, 20);
        $this->line("    <fg=white>{$pad}</> : <fg=yellow>{$value}</>");
    }

    private function printVerdict(string $label, ?float $rmse, ?float $mae, ?float $r2): void
    {
        $this->line('');
        $this->line('  <fg=cyan>Reliability Verdict</>');

        if ($r2 !== null) {
            if ($r2 >= 0.85) {
                $verdict = '<fg=green>STRONG fit</> — the regression explains most revenue variance.';
            } elseif ($r2 >= 0.60) {
                $verdict = '<fg=yellow>MODERATE fit</> — the model captures a reasonable trend but has gaps.';
            } else {
                $verdict = '<fg=red>WEAK fit</> — consider more history or review data quality.';
            }
            $this->line("    R² verdict  : {$verdict}");
        }

        if ($mae !== null) {
            $this->line("    MAE verdict : The model is off by <fg=yellow>PHP ".number_format($mae, 2)."</> on average per period.");
        }

        if ($rmse !== null && $mae !== null) {
            $ratio = $mae > 0 ? round($rmse / $mae, 2) : null;
            if ($ratio !== null) {
                $ratioTag = $ratio <= 1.5 ? '<fg=green>' : '<fg=yellow>';
                $this->line("    RMSE/MAE    : {$ratioTag}{$ratio}</> (closer to 1.0 means fewer extreme outlier errors)");
            }
        }
    }

    private function printPaxVerdict(string $label, ?float $rmse, ?float $mae): void
    {
        $this->line('');
        $this->line('  <fg=cyan>Reliability Verdict</>');

        if ($mae !== null) {
            $this->line("    MAE verdict : Pax demand is off by <fg=yellow>".number_format($mae, 1)." guests</> on average per period.");
        }

        if ($rmse !== null && $mae !== null && $mae > 0) {
            $ratio    = round($rmse / $mae, 2);
            $ratioTag = $ratio <= 1.5 ? '<fg=green>' : '<fg=yellow>';
            $this->line("    RMSE/MAE    : {$ratioTag}{$ratio}</> (closer to 1.0 means fewer extreme outlier errors)");
        }
    }

    private function printFooter(): void
    {
        $this->line('');
        $this->line('  ════════════════════════════════════════════════════════════════════');
        $this->line('  <fg=green;options=bold>✔ Evaluation complete.</> Results above confirm model behavior against');
        $this->line('    real historical data. These metrics are for verification only and');
        $this->line('    are NOT displayed on any website page.');
        $this->line('  ════════════════════════════════════════════════════════════════════');
        $this->line('');
    }

    private function fmt(?float $value): string
    {
        return $value !== null ? number_format($value, 4) : 'N/A';
    }

    private function peso(float|int|null $amount): string
    {
        return $amount !== null ? 'PHP '.number_format((float) $amount, 2) : 'N/A';
    }

    private function quote(string $text): string
    {
        return '"'.$text.'"';
    }
}
