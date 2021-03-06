/*
 * Copyright (C) 2011 Flamingo Project (http://www.cloudine.io).
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
Ext.define('Flamingo2.view.pig.editor.Editor', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.pigEditor',

    requires: [
        'Flamingo2.view.pig.editor.ResultSearchGridPanel',
        'Flamingo2.view.pig.editor.QueryEditor',
        'Flamingo2.view.pig.editor.EditorController',
        'Flamingo2.view.pig.editor.EditorModel'
    ],

    controller: 'pigEditorController',
    viewModel: {
        type: 'pigEditorModel'
    },

    layout: 'border',
    border: false,
    items: [
        {
            xtype: 'pigLatinEditor',
            reference: 'queryEditor',
            itemId: 'editor',
            region: 'center',
            theme: 'eclipse',
            printMargin: false,
            parser: 'hive',
            flex: 1
        },
        {
            xtype: 'tabpanel',
            region: 'south',
            border: false,
            reference: 'tabpanel',
            itemId: 'tabpanel',
            collapsible: false,
            split: true,
            flex: 1,
            items: [
                {
                    xtype: 'pigLatinEditor',
                    title: message.msg('common.log'),
                    layout: 'fit',
                    itemId: 'logviewer',
                    reference: 'logViewer',
                    parser: 'plain_text',
                    forceFit: true,
                    theme: 'eclipse',
                    printMargin: false,
                    readOnly: true,
                    useWrapMode: 80,
                    value: '',
                    runner: new Ext.util.TaskRunner(),
                    listeners: {
                        afterrender: function (comp) {
                            // Toolbar를 없앤다.
                            comp.down('toolbar').setVisible(false);
                        }
                    }
                }
            ]
        }

    ],

    listeners: {
        beforeclose: 'onBeforeclose',
        destroy: 'onDestroy'
    }
});

