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
Ext.define('Flamingo2.view.designer.editor.Panel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.AceEditor',
    mixins: {
        editor: 'Flamingo2.view.designer.editor.Editor'
    },
    layout: 'fit',
    autofocus: true,
    border: false,

    listeners: {
        resize: function () {
            if (this.editor) {
                this.editor.resize();
            }
        },
        activate: function () {
            if (this.editor && this.autofocus) {
                this.editor.focus();
            }
        },
        editorcreated: function (comp) {
            // AceEditor가 생성되었을 때 스크립트의 내용을 설정한다.
            comp.setValue(this.script);
        }
    },

    initComponent: function () {
        var me = this,
            items = {
                xtype: 'component'
            };

        Ext.apply(me, {
            items: items
        });

        me.callParent(arguments);
    },

    onRender: function () {
        var me = this;

        if (me.sourceEl != null) {
            //me.sourceCode = Ext.get(me.sourceEl).getHTML();
            //me.sourceCode = Ext.get(me.sourceEl).dom.innerHTML;
            me.sourceCode = Ext.get(me.sourceEl).dom.outerText;
            //me.sourceCode = Ext.get(me.sourceEl).dom.value;
        }

        me.editorId = me.items.keys[0];
        me.oldSourceCode = me.sourceCode;

        me.callParent(arguments);

        // init editor on afterlayout
        me.on('afterlayout', function () {
            if (me.url) {
                Ext.Ajax.request({
                    url: me.url,
                    success: function (response) {
                        me.sourceCode = response.responseText;
                        me.initEditor();
                    }
                });
            }
            else {
                me.initEditor();
            }

        }, me, {
            single: true
        });
    },

    setScript: function (script) {
        this.script = script;
    }
});