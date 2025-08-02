# -*- coding: utf-8 -*-

from odoo import models, fields

class ProductionLine(models.Model):
    _name = 'bms.production.line'
    _description = 'Production Line'

    name = fields.Char(string="Line Name", required=True)
    location = fields.Char(string="Location")
    capacity = fields.Float(string="Capacity (units/hour)")

class QcWorkflow(models.Model):
    _name = 'bms.qc.workflow'
    _description = 'Quality Control Workflow'

    name = fields.Char(string="Workflow Name", required=True)
    description = fields.Text(string="Description")

    # In a real scenario, this would be a one2many to a qc.step model
    qc_steps = fields.Text(
        string="QC Steps",
        help="Define the QC steps, one per line."
    )

class MrpProduction(models.Model):
    _inherit = 'mrp.production'

    production_line_id = fields.Many2one(
        'bms.production.line',
        string="Production Line",
        help="The production line where this manufacturing order is being processed."
    )

    qc_workflow_id = fields.Many2one(
        'bms.qc.workflow',
        string="QC Workflow",
        help="The quality control workflow to be followed for this order."
    )
