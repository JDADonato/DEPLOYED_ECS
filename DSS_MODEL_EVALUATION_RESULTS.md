# DSS Model Evaluation Results

## Summary

The Decision Support System (DSS) analytics were updated to include model testing and performance evaluation for the forecasting features used in the Admin Analytics dashboard.

Before this update, the system generated forecasts but did not clearly show how reliable those forecasts were. After this update, the system now evaluates the forecasting models using historical data and displays the results in the dashboard.

## Implemented Evaluation Features

### 1. Revenue Forecast Evaluation using Simple Linear Regression

The revenue forecast uses Simple Linear Regression (SLR) to estimate future revenue trends.

The system now:

- Uses historical verified/paid monthly revenue data.
- Splits the data chronologically into training and testing sets.
- Uses the first 80% of the data for training.
- Uses the last 20% of the data for testing.
- Trains the regression formula using only the training data.
- Predicts the revenue values in the test set.
- Compares predicted values against actual values.
- Calculates model evaluation metrics.

The evaluation metrics returned are:

- RMSE
- MAE
- R² score

The actual future projection still uses the full historical dataset so the final forecast uses all available information.

### 2. Pax Demand Evaluation using Simple Moving Average

The pax demand forecast uses a Simple Moving Average (SMA) model.

The system now:

- Uses historical monthly guest count data.
- Uses the configured SMA window, defaulting to 3 months.
- Backtests the model against historical data.
- For each month with enough previous data, predicts pax using the previous months.
- Compares the prediction against the actual pax count.
- Calculates model evaluation metrics.

The evaluation metrics returned are:

- RMSE
- MAE

## Metrics Explained Simply

### RMSE

RMSE means Root Mean Squared Error.

It shows the typical size of the forecasting error, with larger errors being penalized more. A lower RMSE means the model is generally closer to the actual results.

### MAE

MAE means Mean Absolute Error.

It shows the average difference between the forecasted value and the actual value. For example, if the revenue MAE is PHP 5,000, it means the model has historically been off by around PHP 5,000 on average.

### R² Score

R² shows how well the regression model explains the movement in the historical data.

A higher R² means the model fits the historical revenue trend better. A lower R² means the revenue pattern may be less predictable using a simple straight-line model.

## Dashboard Result

The Admin Analytics dashboard now includes Model Evaluation cards under the forecast charts.

For the revenue forecast, the dashboard displays:

- RMSE
- MAE
- R² score
- Interpretation text explaining the result

For the pax demand forecast, the dashboard displays:

- RMSE
- MAE
- Interpretation text explaining the result

If there is not enough historical data, the dashboard does not show misleading zero values. Instead, it shows a clear insufficient-data message.

## Backend Result

The model evaluation was added inside the existing analytics service instead of creating a new controller.

The main backend update was made in:

- `App\Services\AdminReportService`

The existing analytics API response structure was preserved. The evaluation data was added to the existing forecast payloads.

Revenue forecast payloads now include an `evaluation` object with:

- `method`
- `trainSize`
- `testSize`
- `rmse`
- `mae`
- `r2`
- `trainPeriodLabels`
- `testPeriodLabels`
- `interpretation`

Pax demand forecast payloads now include an `evaluation` object with:

- `method`
- `window`
- `backtestSize`
- `rmse`
- `mae`
- `interpretation`

## Frontend Result

The Admin Analytics dashboard was updated to read and display the new evaluation data.

The main frontend update was made in:

- `resources/js/Pages/DashboardAdmin.jsx`

The dashboard continues to use the existing chart behavior and `LazyRecharts.jsx` wrapper.

## Testing Result

The analytics test coverage was updated to verify that:

- Revenue SLR forecast payloads include evaluation data.
- Revenue SLR metrics are non-null when enough historical data exists.
- Pax SMA forecast payloads include evaluation data.
- Pax SMA metrics are non-null when enough historical data exists.
- Insufficient-data cases safely return null metrics and explanatory text.
- Existing forecast metadata and projection behavior still work.

The focused analytics test passed:

```powershell
.\php\php.exe artisan test --filter=PaperAlignedAnalyticsTest
```

The frontend build also passed:

```powershell
npm.cmd run build
```

The full Laravel test suite passed after the related fixes were completed.

## Final Result

The DSS forecasting feature is now more defensible because it does not only show predictions. It also shows how accurate the forecasting models have been when tested against historical data.

This helps explain the reliability of the system to evaluators, panelists, and users.

