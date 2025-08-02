# -*- coding: utf-8 -*-
{
    'name': "BMS Odoo Integration",

    'summary': """
        Integrates the Battery Management System with Odoo ERP.
        This module adds features for rental, manufacturing, and more.""",

    'description': """
        A comprehensive integration module for the BMS application.
        - Equipment rental bookings
        - Battery health reports
        - Vendor and stock tracking
        - Production line and QC workflow
    """,

    'author': "Jules",
    'website': "https://www.example.com",

    # Categories can be used to filter modules in modules listing
    # Check https://github.com/odoo/odoo/blob/16.0/odoo/addons/base/data/ir_module_category_data.xml
    # for the full list
    'category': 'Uncategorized',
    'version': '0.1',

    # any module necessary for this one to work correctly
    'depends': ['base', 'sale_renting', 'stock', 'account_accountant', 'mrp', 'website'],

    # always loaded
    'data': [
        'data/ir_cron_data.xml',
        # 'security/ir.model.access.csv',
        # 'views/views.xml',
        # 'views/templates.xml',
    ],
    # only loaded in demonstration mode
    'demo': [
        # 'demo/demo.xml',
    ],
    'installable': True,
    'application': True,
}
