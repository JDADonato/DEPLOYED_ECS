<?php

namespace App\Services;

use App\Models\FoodTasting;
use Carbon\Carbon;
use Illuminate\Validation\ValidationException;

class FoodTastingScheduleService
{
    public const DAILY_CAPACITY = 6;

    public const CAPACITY_STATUSES = [
        'Pending',
        'Contacted',
        'Approved',
        'Confirmed',
        'Rescheduled',
    ];

    public static function validateCustomerSlot(string $date, string $time, ?int $ignoreTastingId = null): void
    {
        $errors = [];

        try {
            $preferredDate = Carbon::parse($date)->startOfDay();
        } catch (\Throwable) {
            $errors['preferred_date'][] = 'Choose a valid food tasting date.';
            $preferredDate = null;
        }

        if ($preferredDate) {
            $minimumDate = now()->startOfDay()->addDays(3);

            if ($preferredDate->lt($minimumDate)) {
                $errors['preferred_date'][] = 'Food tastings require at least 3 days lead time.';
            }

            if (! in_array((int) $preferredDate->dayOfWeek, [Carbon::FRIDAY, Carbon::SATURDAY, Carbon::SUNDAY], true)) {
                $errors['preferred_date'][] = 'Food tastings are only available Friday to Sunday.';
            }

            if (self::isDateFull($preferredDate->toDateString(), $ignoreTastingId)) {
                $errors['preferred_date'][] = 'That food tasting date is already full. Please choose another Friday, Saturday, or Sunday.';
            }
        }

        if (! self::isValidTime($time)) {
            $errors['preferred_time'][] = 'Food tastings are only available between 11:00 AM and 3:00 PM.';
        }

        if ($errors !== []) {
            throw ValidationException::withMessages($errors);
        }
    }

    public static function isValidTime(?string $time): bool
    {
        if (! is_string($time) || trim($time) === '') {
            return false;
        }

        $normalized = trim($time);
        if (! preg_match('/^(\d{1,2}):(\d{2})(?::\d{2})?$/', $normalized, $matches)) {
            return false;
        }

        $hour = (int) $matches[1];
        $minute = (int) $matches[2];
        $minutes = ($hour * 60) + $minute;

        return $minute >= 0
            && $minute <= 59
            && $minutes >= (11 * 60)
            && $minutes <= (15 * 60);
    }

    public static function isDateFull(string $date, ?int $ignoreTastingId = null): bool
    {
        return self::capacityCountForDate($date, $ignoreTastingId) >= self::DAILY_CAPACITY;
    }

    public static function capacityCountForDate(string $date, ?int $ignoreTastingId = null): int
    {
        return FoodTasting::query()
            ->whereDate('preferred_date', $date)
            ->whereIn('status', self::CAPACITY_STATUSES)
            ->when($ignoreTastingId, fn ($query) => $query->whereKeyNot($ignoreTastingId))
            ->count();
    }

    public static function fullDatesForMonth(int $year, int $month): array
    {
        $start = Carbon::create($year, $month, 1)->startOfMonth();
        $end = $start->copy()->endOfMonth();

        return FoodTasting::query()
            ->selectRaw('preferred_date, COUNT(*) as tasting_count')
            ->whereBetween('preferred_date', [$start->toDateString(), $end->toDateString()])
            ->whereIn('status', self::CAPACITY_STATUSES)
            ->groupBy('preferred_date')
            ->havingRaw('COUNT(*) >= ?', [self::DAILY_CAPACITY])
            ->pluck('preferred_date')
            ->map(fn ($date) => Carbon::parse($date)->toDateString())
            ->values()
            ->all();
    }
}
