import React from 'react';

const StaffPageHeader = ({
    title,
    description,
    actions,
    metrics = [],
    primaryContent = null,
}) => {
    return (
        <section className="staff-page-header">
            <div className="staff-page-header-main">
                {primaryContent || (
                    <>
                        <h2>{title}</h2>
                        {description && <p className="staff-page-header-description">{description}</p>}
                    </>
                )}
            </div>
            <div className="staff-header-utilities">
                {metrics.length > 0 && (
                    <div className="staff-header-metrics" style={{ '--metric-count': metrics.length }}>
                        {metrics.map((metric) => (
                            <div key={metric.label} className={metric.helpText ? 'has-help' : undefined} tabIndex={metric.helpText ? 0 : undefined}>
                                <span>{metric.label}</span>
                                <strong>{metric.value}</strong>
                                {metric.helpText && (
                                    <em className="staff-header-metric-tooltip" role="tooltip">
                                        {metric.helpText}
                                    </em>
                                )}
                            </div>
                        ))}
                    </div>
                )}
                {actions && <div className="staff-header-actions">{actions}</div>}
            </div>
        </section>
    );
};

export default StaffPageHeader;
