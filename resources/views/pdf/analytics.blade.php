<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>{{ $title }}</title>
    @include('pdf.partials.styles')
    <style>
        /* ── Analytics-specific styles ── */

        .filter-bar {
            margin-bottom: 14px;
            color: #64748b;
            font-size: 10px;
            font-weight: 700;
        }

        .executive-summary {
            border: 2px solid #720101;
            background: #fffaf3;
            padding: 14px 16px;
            margin-bottom: 20px;
            page-break-inside: avoid;
        }

        .executive-summary-title {
            margin: 0 0 10px;
            color: #720101;
            font-size: 14px;
            font-weight: 800;
        }

        .takeaway {
            border-bottom: 1px solid #eadfd8;
            padding: 7px 0;
        }

        .takeaway:last-child {
            border-bottom: 0;
            padding-bottom: 0;
        }

        .takeaway-headline {
            color: #1a1a1a;
            font-size: 11px;
            font-weight: 800;
        }

        .severity-label {
            display: inline-block;
            border-radius: 3px;
            font-size: 8px;
            font-weight: 800;
            letter-spacing: .8px;
            padding: 2px 7px;
            text-transform: uppercase;
            margin-left: 6px;
        }

        .severity-high {
            background: #fff1f2;
            color: #9b111e;
            border: 1px solid #fecdd3;
        }

        .severity-medium {
            background: #fffbeb;
            color: #92400e;
            border: 1px solid #fde68a;
        }

        .severity-low {
            background: #f0fdf4;
            color: #166534;
            border: 1px solid #bbf7d0;
        }

        .severity-info {
            background: #eff6ff;
            color: #1e40af;
            border: 1px solid #bfdbfe;
        }

        .section-break {
            page-break-before: always;
        }

        .method-label {
            color: #a16207;
            font-size: 9px;
            font-weight: 700;
            letter-spacing: 1px;
            text-transform: uppercase;
            margin-bottom: 4px;
        }

        .insight-box {
            border: 1px solid #eadfd8;
            background: #fffaf3;
            padding: 12px 14px;
            margin-bottom: 14px;
            page-break-inside: avoid;
        }

        .insight-headline {
            margin: 0 0 10px;
            color: #720101;
            font-size: 12px;
            font-weight: 800;
        }

        .insight-grid {
            display: table;
            width: 100%;
            table-layout: fixed;
        }

        .insight-grid-row {
            display: table-row;
        }

        .insight-grid-cell {
            display: table-cell;
            vertical-align: top;
            width: 50%;
            padding: 6px 8px;
        }

        .insight-grid-cell-label {
            margin: 0 0 3px;
            color: #a16207;
            font-size: 8px;
            font-weight: 800;
            letter-spacing: 1px;
            text-transform: uppercase;
        }

        .insight-grid-cell-value {
            color: #1a1a1a;
            font-size: 10px;
            font-weight: 600;
            line-height: 1.45;
        }
    </style>
</head>
<body>

    {{-- ── Brand Header ── --}}
    <header class="brand-bar">
        <div class="brand-kicker">{{ $brandName }} · Analytics Export</div>
        <h1 class="brand-title">{{ $title }}</h1>
        <div class="brand-meta">
            Generated {{ $generatedAt->format('M j, Y g:i A') }}
        </div>
    </header>

    {{-- ── Filter Summary ── --}}
    @if ($filterSummary)
        <div class="filter-bar">
            <strong>Filters:</strong> {{ $filterSummary }}
        </div>
    @endif

    {{-- ── Executive Summary ── --}}
    @if (!empty($takeaways))
        <div class="executive-summary">
            <h2 class="executive-summary-title">Executive Summary</h2>
            @foreach ($takeaways as $takeaway)
                <div class="takeaway">
                    <span class="takeaway-headline">{{ $takeaway['headline'] }}</span>
                    @if (!empty($takeaway['severity']))
                        <span class="severity-label severity-{{ $takeaway['severity'] }}">
                            {{ $takeaway['severity'] }}
                        </span>
                    @endif
                </div>
            @endforeach
        </div>
    @endif

    {{-- ── Sections ── --}}
    @foreach ($sections as $idx => $section)
        <section class="section{{ $idx > 0 ? ' section-break' : '' }}">

            {{-- Section heading --}}
            @if (!empty($section['method']))
                <div class="method-label">{{ $section['method'] }}</div>
            @endif
            <h2 class="section-title">{{ $section['title'] }}</h2>

            {{-- Insight box (optional) --}}
            @if (!empty($section['insight']))
                @php $insight = $section['insight']; @endphp
                <div class="insight-box">
                    <div style="margin-bottom: 6px;">
                        <span class="insight-headline">{{ $insight['headline'] ?? '' }}</span>
                        @if (!empty($insight['severity']))
                            <span class="severity-label severity-{{ $insight['severity'] }}">
                                {{ $insight['severity'] }}
                            </span>
                        @endif
                    </div>
                    <div class="insight-grid">
                        <div class="insight-grid-row">
                            <div class="insight-grid-cell">
                                <p class="insight-grid-cell-label">What is happening</p>
                                <p class="insight-grid-cell-value">{{ $insight['what_is_happening'] ?? '—' }}</p>
                            </div>
                            <div class="insight-grid-cell">
                                <p class="insight-grid-cell-label">Why it matters</p>
                                <p class="insight-grid-cell-value">{{ $insight['why_it_matters'] ?? '—' }}</p>
                            </div>
                        </div>
                        <div class="insight-grid-row">
                            <div class="insight-grid-cell">
                                <p class="insight-grid-cell-label">Root cause</p>
                                <p class="insight-grid-cell-value">{{ $insight['root_cause'] ?? '—' }}</p>
                            </div>
                            <div class="insight-grid-cell">
                                <p class="insight-grid-cell-label">What to do next</p>
                                <p class="insight-grid-cell-value">{{ $insight['what_to_do_next'] ?? '—' }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            @endif

            {{-- Data table --}}
            @if (!empty($section['columns']) && !empty($section['rows']))
                <table class="flat-table">
                    <thead>
                        <tr>
                            @foreach ($section['columns'] as $col)
                                <th>{{ $col }}</th>
                            @endforeach
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($section['rows'] as $row)
                            <tr>
                                @foreach ($row as $cell)
                                    <td>{{ $cell }}</td>
                                @endforeach
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            @else
                <div class="note">No data available for this section.</div>
            @endif

        </section>
    @endforeach

    <div class="footer-note">
        This report was generated automatically by {{ $brandName }}. Data reflects the applied filters at the time of generation.
    </div>

</body>
</html>
