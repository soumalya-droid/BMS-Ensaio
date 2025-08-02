# -*- coding: utf-8 -*-

from odoo import models, fields

class BatteryHealthReport(models.Model):
    _name = 'bms.battery.health.report'
    _description = 'Battery Health Report'
    _order = 'report_date desc'

    battery_device_id = fields.Char(
        string="Battery Device ID",
        required=True,
        index=True,
        help="The unique identifier of the battery from the BMS."
    )

    report_date = fields.Datetime(
        string="Report Date",
        required=True,
        default=fields.Datetime.now,
        help="The date and time when the report was generated."
    )

    state_of_health = fields.Integer(
        string="State of Health (%)",
        help="The State of Health (SOH) of the battery."
    )

    cycle_count = fields.Integer(
        string="Cycle Count",
        help="The number of charge/discharge cycles the battery has undergone."
    )

    pack_voltage = fields.Integer(
        string="Pack Voltage (mV)",
        help="The total voltage of the battery pack."
    )

    pack_current = fields.Integer(
        string="Pack Current (mA)",
        help="The current flowing in or out of the battery pack."
    )

    temperature = fields.Float(
        string="Average Temperature (°C)",
        help="Average temperature of the battery cells."
    )

    # This is a placeholder for the synchronization logic
    # that will pull data from the external BMS database.
    # We will implement this with a scheduled action later.
    is_synced = fields.Boolean(
        string="Is Synced",
        default=False,
        help="Indicates if this report was synced from the external BMS DB."
    )

    name = fields.Char(
        string="Name",
        compute='_compute_name',
        store=True,
        help="The name of the report, computed from battery ID and date."
    )

    def _compute_name(self):
        for report in self:
            if report.battery_device_id and report.report_date:
                report.name = f"Report for {report.battery_device_id} on {fields.Date.to_string(report.report_date)}"
            else:
                report.name = "New Battery Health Report"
