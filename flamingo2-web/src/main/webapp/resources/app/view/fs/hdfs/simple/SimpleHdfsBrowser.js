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

Ext.define('Flamingo2.view.fs.hdfs.simple.SimpleHdfsBrowser', {
    extend: 'Ext.window.Window',

    requires: [
        'Flamingo2.view.fs.hdfs.simple.SimpleHdfsBrowserController',
        'Flamingo2.view.fs.hdfs.simple.SimpleHdfsBrowserModel'
    ],

    config: {
        /**
         * @cfg {String} closeEvent
         * 'OK' 버튼클릭 시 부모 View로 발생하는 이벤트 명
         */
        beforeCloseEvent: 'simpleHdfsBeforeOk',
        /**
         * @cfg {String} closeEvent
         * 'OK' 버튼클릭 시 부모 View로 발생하는 이벤트 명
         */
        closeEvent: 'hdfsclose',
        /**
         * @cfg {String} closeEvent
         * Disable처리를 해야하는 Node의 record
         */
        disableRecord: null
    },

    controller: 'simpleHdfsBrowserController',

    viewModel: {
        type: 'simpleHdfsBrowserModel'
    },

    title: message.msg('fs.hdfs.common.browser'),
    height: 400,
    width: 400,
    layout: 'fit',
    modal: true,
    closeAction: 'destroy',

    items: [
        {
            xtype: 'treepanel',
            reference: 'trpDirectory',
            bind: {
                store: '{directoryStore}'
            },
            border: false
        }
    ],
    buttonAlign: 'center',
    buttons: [
        {
            text: message.msg('common.ok'),
            iconCls: 'common-ok',
            handler: 'onOkClick'
        },
        {
            text: message.msg('common.cancel'),
            iconCls: 'common-cancel',
            handler: 'onCancelClick'
        }
    ],
    listeners: {
        afterrender: 'onAfterRender',
        containercontextmenu: function (tree, event) {
            event.stopEvent();
        }
    }
});