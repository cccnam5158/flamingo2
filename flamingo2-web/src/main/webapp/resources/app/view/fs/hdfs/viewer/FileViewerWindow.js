/*
 * Copyright (C) 2011  Flamingo Project (http://www.cloudine.io).
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

Ext.define('Flamingo2.view.fs.hdfs.viewer.FileViewerWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.fileViewerWindow',

    requires: [
        'Flamingo2.view.hive.editor.QueryEditor',
        'Flamingo2.view.fs.hdfs.viewer.FileViewerController',
        'Flamingo2.view.fs.hdfs.viewer.FileViewerForm'
    ],

    controller: 'fileViewerViewController',

    title: message.msg('fs.hdfs.viewer.title'),
    height: 550,
    width: 850,
    modal: true,
    maximizable: false,
    resizable: false,
    closeAction: 'destroy',
    layout: 'fit',
    afterPageText: '/ {0}',
    emptyPageData: {
        total: '{0}',
        currentPage: '{0}',
        pageCount: 0,
        toRecord: 0,
        fromRecord: 0
    },

    items: [
        {
            xtype: 'fileViewerForm'
        }
    ],

    listeners: {
        afterrender: 'onAfterRender'
    }
});