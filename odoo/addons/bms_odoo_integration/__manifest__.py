# -*- coding: utf-8 -*-
{
    'name': "EV Management",

    'summary': """
        A module for managing EV batteries, rentals, and manufacturing.""",

    'description': """
        A comprehensive module for EV management, including:
        - Equipment rental bookings
        - Battery health reports
        - Vendor and stock tracking
        - Production line and QC workflow
    """,

    'author': "Your Company",
    'website': "https://www.example.com",

    'category': 'Uncategorized',
    'version': '0.1',

    'depends': ['base', 'sale_renting', 'stock', 'account_accountant', 'mrp'],

    # always loaded
    'data': [
        'data/ir_cron_data.xml',
    ],
    'installable': True,
    'application': True,
}
