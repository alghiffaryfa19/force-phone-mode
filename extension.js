/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */
import { Extension } from "resource:///org/gnome/shell/extensions/extension.js";
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
import {
  QuickToggle,
  SystemIndicator,
} from "resource:///org/gnome/shell/ui/quickSettings.js";
import GObject from 'gi://GObject';


function enablePhoneMode() {
  Main.layoutManager._checkIsPhone = () => true;
  Main.layoutManager._updateIsPhone();
}

function disablePhoneMode() {
  Main.layoutManager._checkIsPhone = () => false;
  Main.layoutManager._updateIsPhone();
}

const MobileToggle = GObject.registerClass(
class MobileToggle extends QuickToggle {
    _init(extensionObject) {
        super._init({
            title: _('Mobile mode'),
            iconName: 'phone-symbolic',
            toggleMode: true,
        });

        this.checked = true;

        this.connect('clicked', () => {
          if (this.checked) {
            enablePhoneMode();
          } else {
            disablePhoneMode();
          }
        });
    }
});

const Indicator = GObject.registerClass(
  class Indicator extends SystemIndicator {
    constructor() {
      super();
      const toggle = new MobileToggle();
      this.quickSettingsItems.push(toggle);
    }
  }
);

export default class ForcePhoneModeExtension extends Extension {
  enable() {
    enablePhoneMode();
    this._indicator = new Indicator();
    Main.panel.statusArea.quickSettings.addExternalIndicator(this._indicator);
  }

  disable() {
    disablePhoneMode();
    this._indicator.quickSettingsItems.forEach((item) => item.destroy());
    this._indicator.destroy();
    this._indicator = null;
  }
}
