# The Comprehensive Guide to SMA (Simple Moving Average) in ECS

> [!NOTE]
> This guide covers the **Simple Moving Average (SMA)** forecasting model implemented inside the admin analytics page of the local codebase (Event Catering System - ECS). It explains the math, the purpose, and how it is evaluated.

## 1. What is the SMA Analytics?
In the context of the ECS admin system, **SMA** stands for **Simple Moving Average**. It is a predictive analytics algorithm integrated into the system's Decision Support System (DSS) to forecast future passenger/guest (pax) demand. It provides administrators and executives with a data-driven baseline for upcoming operational capacity requirements.

## 2. How Does It Work?
The core formula for SMA is:
**`SMA = (P1 + P2 + ... + Pn) / n`**
- **`P`**: Historical pax demand per period.
- **`n`**: The configured moving-average window (number of previous periods to look back).

**The "Average Pax" Strategy:**
Interestingly, the system doesn't run the SMA directly on the total monthly guest count because total pax is highly volatile depending on how many events are booked (which can fluctuate wildly). Instead, the system takes a smarter approach:
1. It calculates the **average guests per booking** (average pax per event) for each historical period, which is a much more stable metric.
2. It uses the SMA to forecast the *average guests per booking* for the next period.
3. It uses a separate SMA to forecast the *expected number of events*.
4. Finally, it multiplies the **Forecasted Average Pax** by the **Forecasted Events** to determine the total forecasted pax requirement for the target horizon.

> [!TIP]
> The system dynamically auto-selects the best window size by testing windows of 2, 3, 4, and 5 periods and choosing the one that yields the lowest error margin during backtesting. If there isn't enough data for the best window, it falls back to the default configured window (usually 3 periods).

## 3. How is the Data Obtained?
The data is sourced directly from the local MySQL database via the `AdminReportService.php` backend service:
1. The system fetches all bookings with a status of `Pending`, `Confirmed`, or `Completed`.
2. It filters these bookings based on the defined date range.
3. It groups the bookings chronologically by period (e.g., months).
4. For each period, it calculates the total number of events and the sum of all guests (pax) to establish the historical baseline used by the SMA algorithm.

## 4. What is its Purpose?
The primary purpose of the SMA model is to project **operational capacity requirements**. By accurately estimating how many guests the catering service will need to serve in the upcoming months, the system removes the guesswork from capacity planning.

## 5. Why Does the Business Need It?
The business (Smart Budget Maximizer & Smart Booking Wizard ecosystem) relies on the SMA forecast for several critical functions:
- **Inventory & Supply Chain:** It ensures that raw ingredient inventory aligns with the baseline projection *before* finalizing commitments with suppliers.
- **Resource Allocation:** Helps operations know if they need to hire temporary staff or acquire extra equipment for peak periods.
- **Strategic Planning:** It provides executives with a consistent guest baseline for long-term strategic planning.
- **Financial Projections:** When paired with the Simple Linear Regression (SLR) revenue model, the SMA pax demand completes the picture of the business's future trajectory.

## 6. What is Used for Doing the Analytics?
The analytics are entirely bespoke and built directly into the application backend:
- **PHP 8 / Laravel:** The algorithm is coded natively in PHP within `app/Services/AdminReportService.php`.
- **Database Aggregation:** SQL aggregations handle the heavy lifting of grouping historical bookings and counting pax.
- **Artisan Console Commands:** A dedicated command line utility (`php artisan dss:evaluate-models`) is used by developers and admins to verify the math without needing a UI.

## 7. How is it Tested and Evaluated?
Because this is a statistical model, it needs to be rigorously evaluated against historical data to prove its reliability. The system uses **Historical Backtesting** to score the SMA model.

### The Backtesting Process
The system goes back in time, hides the most recent data from itself, and tries to predict it using older data. It then compares its prediction against what actually happened.

### Evaluation Metrics
If there is sufficient data (at least equal to the SMA window), the system calculates:
- **MAE (Mean Absolute Error):** How many guests the prediction is off by, on average (e.g., "The model is off by 12.5 guests on average").
- **RMSE (Root Mean Square Error):** Similar to MAE but heavily penalizes large outlier errors. 
- **RMSE/MAE Ratio:** The system checks the ratio between RMSE and MAE. A ratio close to 1.0 indicates that there are very few extreme outlier errors, resulting in a **"Reliability Verdict"** shown in the terminal.

### The CLI Evaluation Tool
Developers or admins can evaluate the active model in the terminal by running:
```bash
php artisan dss:evaluate-models --pax_sma_window=3
```
This command outputs the current SMA window, the average pax per booking, the exact RMSE and MAE backtest metrics, and a reliability verdict indicating how trustworthy the model's current projections are. If there are fewer historical data points than the window size, the system safely triggers an "Insufficient historical data" warning instead of returning broken math.
