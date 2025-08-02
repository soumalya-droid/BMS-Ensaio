# -*- coding: utf-8 -*-

from odoo import models, fields, api

class SaleOrder(models.Model):
    _inherit = 'sale.order'

    is_battery_rental = fields.Boolean(
        string="Is a Battery Rental",
        default=False,
        help="Check this if the sale order is for renting a battery."
    )

    battery_device_id = fields.Char(
        string="Battery Device ID",
        help="The unique identifier of the battery being rented from the BMS."
    )

    subscription_end_date = fields.Datetime(
        string="Subscription End Date",
        help="The date when the battery rental subscription expires."
    )

    # We can add more fields here later, for example, to link to a specific battery record
    # once we have a model for it.
    # battery_id = fields.Many2one('bms.battery', string="Battery")

    def _check_expired_subscriptions(self):
        """
        This method is called by a cron job to check for expired subscriptions.
        """
        _logger.info("Running cron job to check for expired battery subscriptions...")

        expired_orders = self.search([
            ('is_battery_rental', '=', True),
            ('subscription_end_date', '<', fields.Datetime.now())
        ])

        for order in expired_orders:
            _logger.info(f"Subscription for order {order.name} with battery {order.battery_device_id} has expired.")
            # Here you would call the shutdown API
            # try:
            #     response = requests.post('https://your-shutdown-api.com/shutdown', json={'device_id': order.battery_device_id})
            #     response.raise_for_status()
            #     _logger.info(f"Successfully called shutdown API for {order.battery_device_id}")
            # except requests.exceptions.RequestException as e:
            #     _logger.error(f"Failed to call shutdown API for {order.battery_device_id}: {e}")

        _logger.info("Finished checking for expired subscriptions.")

    @api.onchange('is_battery_rental')
    def _onchange_is_battery_rental(self):
        """
        When 'is_battery_rental' is checked, we can set default values
        or perform other actions. For example, set a default rental product.
        """
        if self.is_battery_rental:
            # This is a placeholder for more complex logic.
            # For instance, you could have a default "Battery Rental" product
            # that gets automatically added to the order line.
            self.note = "This is a battery rental order. Please ensure the battery device ID is specified."
        else:
            self.note = ""
