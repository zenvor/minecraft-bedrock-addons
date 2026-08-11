var No = Object.defineProperty;
var ru = Object.getOwnPropertyDescriptor;
var tu = (e, r, t) =>
  r in e ? No(e, r, { enumerable: !0, configurable: !0, writable: !0, value: t }) : (e[r] = t);
var d = (e, r, t, n) => {
  for (var o = n > 1 ? void 0 : n ? ru(r, t) : r, i = e.length - 1, a; i >= 0; i--)
    (a = e[i]) && (o = (n ? a(r, t, o) : a(o)) || o);
  return (n && o && No(r, t, o), o);
};
var g = (e, r, t) => (tu(e, typeof r != 'symbol' ? r + '' : r, t), t);
import { Direction as J, StructureRotation as jt } from '@minecraft/server';
import { Direction as z, StructureRotation as Vt } from '@minecraft/server';
import '@minecraft/server';
import { Direction as X } from '@minecraft/server';
import { Direction as j } from '@minecraft/server';
import { BlockPermutation as iu, world as wd } from '@minecraft/server';
import { world as au } from '@minecraft/server';
import { Player as Ho } from '@minecraft/server';
import { system as Cd } from '@minecraft/server';
import { system as Qo } from '@minecraft/server';
import { system as jo, world as Jr } from '@minecraft/server';
import { Player as su, system as Bn, world as yt } from '@minecraft/server';
import { system as Wd } from '@minecraft/server';
import { Direction as v } from '@minecraft/server';
import { StructureSaveMode as qd, world as zd } from '@minecraft/server';
import {
  EntityEquippableComponent as Fd,
  EquipmentSlot as Gd,
  GameMode as $d,
  ItemDurabilityComponent as Nd,
  ItemEnchantableComponent as Hd,
} from '@minecraft/server';
var nu = class R {
    constructor(r, t, n) {
      g(this, 'x');
      g(this, 'y');
      g(this, 'z');
      if (r === z.Down) ((this.x = 0), (this.y = -1), (this.z = 0));
      else if (r === z.Up) ((this.x = 0), (this.y = 1), (this.z = 0));
      else if (r === z.North) ((this.x = 0), (this.y = 0), (this.z = -1));
      else if (r === z.South) ((this.x = 0), (this.y = 0), (this.z = 1));
      else if (r === z.East) ((this.x = 1), (this.y = 0), (this.z = 0));
      else if (r === z.West) ((this.x = -1), (this.y = 0), (this.z = 0));
      else if (typeof r == 'number') ((this.x = r), (this.y = t), (this.z = n));
      else if (Array.isArray(r)) ((this.x = r[0]), (this.y = r[1]), (this.z = r[2]));
      else if (r instanceof R || r instanceof f) ((this.x = r.x), (this.y = r.y), (this.z = r.z));
      else {
        if (!r || (!r.x && r.x !== 0) || (!r.y && r.y !== 0) || (!r.z && r.z !== 0))
          throw new Error('Invalid vector');
        ((this.x = r.x), (this.y = r.y), (this.z = r.z));
      }
    }
    static from(r, t, n) {
      if (r instanceof R) return new R(r);
      if (typeof r == 'number' && t !== void 0 && n !== void 0) return new R(r, t, n);
      if (Array.isArray(r)) return new R(r);
      if (r === z.Down) return new R(z.Down);
      if (r === z.Up) return new R(z.Up);
      if (r === z.North) return new R(z.North);
      if (r === z.South) return new R(z.South);
      if (r === z.East) return new R(z.East);
      if (r === z.West) return new R(z.West);
      if (!r || (!r.x && r.x !== 0) || (!r.y && r.y !== 0) || (!r.z && r.z !== 0))
        throw new Error('Invalid arguments');
      return new R(r.x, r.y, r.z);
    }
    static _from(r, t, n) {
      if (r instanceof R) return r;
      if (typeof r == 'number' && t !== void 0 && n !== void 0) return new R(r, t, n);
      if (Array.isArray(r)) return new R(r);
      if (r === z.Down) return new R(z.Down);
      if (r === z.Up) return new R(z.Up);
      if (r === z.North) return new R(z.North);
      if (r === z.South) return new R(z.South);
      if (r === z.East) return new R(z.East);
      if (r === z.West) return new R(z.West);
      if (!r || (!r.x && r.x !== 0) || (!r.y && r.y !== 0) || (!r.z && r.z !== 0))
        throw new Error('Invalid arguments');
      return new R(r.x, r.y, r.z);
    }
    copy() {
      return new R(this.x, this.y, this.z);
    }
    toImmutable() {
      return new f(this.x, this.y, this.z);
    }
    static fromRotation(r, t) {
      let n;
      typeof r == 'number' ? ((n = r), (t = t)) : ((n = r.y), (t = r.x));
      let o = n * (Math.PI / 180),
        i = t * (Math.PI / 180),
        a = -Math.cos(i) * Math.sin(o),
        u = -Math.sin(i),
        _ = Math.cos(i) * Math.cos(o);
      return new R(a, u, _);
    }
    toRotation() {
      if (this.isZero()) throw new Error('Cannot convert zero-length vector to direction');
      let r = this.copy().normalize(),
        t = -Math.atan2(r.x, r.z) * (180 / Math.PI);
      return { x: Math.asin(-r.y) * (180 / Math.PI), y: t };
    }
    add(r, t, n) {
      let o = R._from(r, t, n);
      return ((this.x += o.x), (this.y += o.y), (this.z += o.z), this);
    }
    subtract(r, t, n) {
      let o = R._from(r, t, n);
      return ((this.x -= o.x), (this.y -= o.y), (this.z -= o.z), this);
    }
    multiply(r, t, n) {
      if (typeof r == 'number' && t === void 0 && n === void 0)
        return ((this.x *= r), (this.y *= r), (this.z *= r), this);
      let o = R._from(r, t, n);
      return ((this.x *= o.x), (this.y *= o.y), (this.z *= o.z), this);
    }
    scale(r) {
      return ((this.x *= r), (this.y *= r), (this.z *= r), this);
    }
    divide(r, t, n) {
      if (typeof r == 'number' && t === void 0 && n === void 0) {
        if (r === 0) throw new Error('Cannot divide by zero');
        return ((this.x /= r), (this.y /= r), (this.z /= r), this);
      }
      let o = R._from(r, t, n);
      if (o.x === 0 || o.y === 0 || o.z === 0) throw new Error('Cannot divide by zero');
      return ((this.x /= o.x), (this.y /= o.y), (this.z /= o.z), this);
    }
    normalize() {
      if (this.isZero()) throw new Error('Cannot normalize zero-length vector');
      let r = this.length();
      return ((this.x /= r), (this.y /= r), (this.z /= r), this);
    }
    length() {
      return Math.hypot(this.x, this.y, this.z);
    }
    lengthSquared() {
      return this.x * this.x + this.y * this.y + this.z * this.z;
    }
    cross(r, t, n) {
      let o = R._from(r, t, n),
        i = this.y * o.z - this.z * o.y,
        a = this.z * o.x - this.x * o.z,
        u = this.x * o.y - this.y * o.x;
      return ((this.x = i), (this.y = a), (this.z = u), this);
    }
    distance(r, t, n) {
      let o = R._from(r, t, n);
      return this.copy().subtract(o).length();
    }
    distanceSquared(r, t, n) {
      let o = R._from(r, t, n);
      return this.copy().subtract(o).lengthSquared();
    }
    lerp(r, t) {
      return !r || t === void 0
        ? this
        : t === 1
          ? ((this.x = r.x), (this.y = r.y), (this.z = r.z), this)
          : t === 0
            ? this
            : ((this.x = this.x + (r.x - this.x) * t),
              (this.y = this.y + (r.y - this.y) * t),
              (this.z = this.z + (r.z - this.z) * t),
              this);
    }
    slerp(r, t) {
      if (!r || t === void 0) return this;
      if (t === 1) return ((this.x = r.x), (this.y = r.y), (this.z = r.z), this);
      if (t === 0) return this;
      let n = this.dot(r),
        o = Math.acos(n) * t,
        i = R.from(r).subtract(this.copy().multiply(n)).normalize(),
        a = Math.cos(o),
        u = Math.sin(o);
      return (
        this.multiply(a),
        (this.x += i.x * u),
        (this.y += i.y * u),
        (this.z += i.z * u),
        this
      );
    }
    dot(r, t, n) {
      let o = R._from(r, t, n);
      return this.x * o.x + this.y * o.y + this.z * o.z;
    }
    angleBetween(r, t, n) {
      let o = R._from(r, t, n),
        i = this.dot(o),
        a = this.lengthSquared();
      if (a === 0) return 0;
      let u = o.lengthSquared();
      if (u === 0) return 0;
      let _ = Math.sqrt(a * u),
        s = Math.min(1, Math.max(-1, i / _));
      return Math.acos(s);
    }
    projectOnto(r, t, n) {
      let o = R._from(r, t, n);
      if (o.isZero()) return ((this.x = 0), (this.y = 0), (this.z = 0), this);
      let i = o.dot(o);
      if (i === 0) return ((this.x = 0), (this.y = 0), (this.z = 0), this);
      let a = this.dot(o) / i;
      return ((this.x = o.x * a), (this.y = o.y * a), (this.z = o.z * a), this);
    }
    reflect(r, t, n) {
      let o = R._from(r, t, n),
        a = this.copy().projectOnto(o);
      return this.subtract(a.multiply(2));
    }
    rotate(r, t) {
      let n = (t * Math.PI) / 180 / 2,
        o = Math.cos(n),
        i = r.x * Math.sin(n),
        a = r.y * Math.sin(n),
        u = r.z * Math.sin(n),
        _ = this.x,
        s = this.y,
        c = this.z,
        p =
          o * o * _ +
          2 * a * o * c -
          2 * u * o * s +
          i * i * _ +
          2 * a * i * s +
          2 * u * i * c -
          u * u * _ -
          a * a * _,
        w =
          2 * i * a * _ +
          a * a * s +
          2 * u * a * c +
          2 * o * u * _ -
          u * u * s +
          o * o * s -
          2 * i * o * c -
          i * i * s,
        C =
          2 * i * u * _ +
          2 * a * u * s +
          u * u * c -
          2 * o * a * _ -
          a * a * c +
          2 * o * i * s -
          i * i * c +
          o * o * c;
      return ((this.x = p), (this.y = w), (this.z = C), this);
    }
    update(r, t, n) {
      return (
        r || (r = (o) => o),
        t || (t = (o) => o),
        n || (n = (o) => o),
        (this.x = r(this.x)),
        (this.y = t(this.y)),
        (this.z = n(this.z)),
        this
      );
    }
    setX(r) {
      return (typeof r == 'number' ? (this.x = r) : (this.x = r(this.x)), this);
    }
    setY(r) {
      return (typeof r == 'number' ? (this.y = r) : (this.y = r(this.y)), this);
    }
    setZ(r) {
      return (typeof r == 'number' ? (this.z = r) : (this.z = r(this.z)), this);
    }
    floor() {
      return this.update(Math.floor, Math.floor, Math.floor);
    }
    floorX() {
      return this.setX(Math.floor);
    }
    floorY() {
      return this.setY(Math.floor);
    }
    floorZ() {
      return this.setZ(Math.floor);
    }
    ceil() {
      return this.update(Math.ceil, Math.ceil, Math.ceil);
    }
    ceilX() {
      return this.setX(Math.ceil);
    }
    ceilY() {
      return this.setY(Math.ceil);
    }
    ceilZ() {
      return this.setZ(Math.ceil);
    }
    round() {
      return this.update(Math.round, Math.round, Math.round);
    }
    roundX() {
      return this.setX(Math.round);
    }
    roundY() {
      return this.setY(Math.round);
    }
    roundZ() {
      return this.setZ(Math.round);
    }
    up() {
      return this.add(z.Up);
    }
    down() {
      return this.add(z.Down);
    }
    north() {
      return this.add(z.North);
    }
    south() {
      return this.add(z.South);
    }
    east() {
      return this.add(z.East);
    }
    west() {
      return this.add(z.West);
    }
    isZero() {
      return this.x === 0 && this.y === 0 && this.z === 0;
    }
    toArray() {
      return [this.x, this.y, this.z];
    }
    toDirection() {
      if (this.isZero()) throw new Error('Cannot convert zero-length vector to direction');
      let r = this.copy().normalize(),
        t = Math.max(Math.abs(r.x), Math.abs(r.y), Math.abs(r.z));
      if (t === r.x) return z.East;
      if (t === -r.x) return z.West;
      if (t === r.y) return z.Up;
      if (t === -r.y) return z.Down;
      if (t === r.z) return z.South;
      if (t === -r.z) return z.North;
      throw new Error('Cannot convert vector to direction');
    }
    toStructureRotation() {
      let r = this.toRotation(),
        t = Math.round(r.y / 90) * 90;
      if ((t < 0 && (t += 360), t >= 360 && (t -= 360), t === 0)) return Vt.None;
      if (t === 90) return Vt.Rotate90;
      if (t === 180) return Vt.Rotate180;
      if (t === 270) return Vt.Rotate270;
      throw new Error('Cannot convert vector to structure rotation');
    }
    toBlockLocation() {
      return (
        (this.x = (this.x << 0) - (this.x < 0 && this.x !== this.x << 0 ? 1 : 0)),
        (this.y = (this.y << 0) - (this.y < 0 && this.y !== this.y << 0 ? 1 : 0)),
        (this.z = (this.z << 0) - (this.z < 0 && this.z !== this.z << 0 ? 1 : 0)),
        this
      );
    }
    almostEqual(r, t, n, o) {
      try {
        let i;
        return (
          typeof r != 'number' && n === void 0
            ? ((i = R._from(r, void 0, void 0)), (o = t))
            : (i = R._from(r, t, n)),
          Math.abs(this.x - i.x) <= o && Math.abs(this.y - i.y) <= o && Math.abs(this.z - i.z) <= o
        );
      } catch {
        return !1;
      }
    }
    equals(r, t, n) {
      try {
        let o = R._from(r, t, n);
        return this.x === o.x && this.y === o.y && this.z === o.z;
      } catch {
        return !1;
      }
    }
    toString(r = 'long', t = ', ') {
      let n = `${this.x + t + this.y + t + this.z}`;
      return r === 'long' ? `MutVec3(${n})` : n;
    }
    static fromString(r, t = 'long', n = ', ') {
      if (t === 'long') {
        let o = r.match(/^MutVec3\((.*)\)$/);
        if (!o) throw new Error('Invalid string format');
        let i = o[1].split(n);
        if (i.length !== 3) throw new Error('Invalid string format');
        return new R(Number(i[0]), Number(i[1]), Number(i[2]));
      } else {
        let o = r.split(n);
        if (o.length !== 3) throw new Error('Invalid string format');
        return new R(Number(o[0]), Number(o[1]), Number(o[2]));
      }
    }
  },
  b,
  L =
    ((b = class {
      constructor(r, t) {
        g(this, 'r');
        g(this, 'g');
        g(this, 'b');
        ((this.code = r),
          (this.color = t),
          t && ((this.r = (t >> 16) & 255), (this.g = (t >> 8) & 255), (this.b = t & 255)));
      }
      toString() {
        return b.PREFIX + this.code;
      }
      toRGB() {
        return this.color;
      }
      toHex() {
        return this.color?.toString(16);
      }
      getRed() {
        return this.r;
      }
      getGreen() {
        return this.g;
      }
      getBlue() {
        return this.b;
      }
      getCode() {
        return this.code;
      }
      static stripColor(r) {
        return r.replace(/§[0-9a-u]/g, '');
      }
      static findClosestColor(r, t, n) {
        let o = Number.MAX_VALUE,
          i = b.WHITE;
        for (let a of b.ALL_COLORS)
          if (a.r && a.g && a.b) {
            let u = Math.sqrt(Math.pow(a.r - r, 2) + Math.pow(a.g - t, 2) + Math.pow(a.b - n, 2));
            u < o && ((o = u), (i = a));
          }
        return i;
      }
    }),
    g(b, 'BLACK', new b('0', 0)),
    g(b, 'DARK_BLUE', new b('1', 170)),
    g(b, 'DARK_GREEN', new b('2', 43520)),
    g(b, 'DARK_AQUA', new b('3', 43690)),
    g(b, 'DARK_RED', new b('4', 11141120)),
    g(b, 'DARK_PURPLE', new b('5', 11141290)),
    g(b, 'GOLD', new b('6', 16755200)),
    g(b, 'GRAY', new b('7', 11184810)),
    g(b, 'DARK_GRAY', new b('8', 5592405)),
    g(b, 'BLUE', new b('9', 5592575)),
    g(b, 'GREEN', new b('a', 5635925)),
    g(b, 'AQUA', new b('b', 5636095)),
    g(b, 'RED', new b('c', 16733525)),
    g(b, 'LIGHT_PURPLE', new b('d', 16733695)),
    g(b, 'YELLOW', new b('e', 16777045)),
    g(b, 'WHITE', new b('f', 16777215)),
    g(b, 'MINECOIN_GOLD', new b('g', 14603781)),
    g(b, 'MATERIAL_QUARTZ', new b('h', 14931153)),
    g(b, 'MATERIAL_IRON', new b('i', 13552330)),
    g(b, 'MATERIAL_NETHERITE', new b('j', 4471355)),
    g(b, 'MATERIAL_REDSTONE', new b('m', 9901575)),
    g(b, 'MATERIAL_COPPER', new b('n', 11823181)),
    g(b, 'MATERIAL_GOLD', new b('p', 14594349)),
    g(b, 'MATERIAL_EMERALD', new b('q', 1155126)),
    g(b, 'MATERIAL_DIAMOND', new b('s', 2931368)),
    g(b, 'MATERIAL_LAPIS', new b('t', 2181499)),
    g(b, 'MATERIAL_AMETHYST', new b('u', 10116294)),
    g(b, 'OBFUSCATED', new b('k')),
    g(b, 'BOLD', new b('l')),
    g(b, 'ITALIC', new b('o')),
    g(b, 'RESET', new b('r')),
    g(b, 'VALUES', [
      b.BLACK,
      b.DARK_BLUE,
      b.DARK_GREEN,
      b.DARK_AQUA,
      b.DARK_RED,
      b.DARK_PURPLE,
      b.GOLD,
      b.GRAY,
      b.DARK_GRAY,
      b.BLUE,
      b.GREEN,
      b.AQUA,
      b.RED,
      b.LIGHT_PURPLE,
      b.YELLOW,
      b.WHITE,
      b.MINECOIN_GOLD,
      b.MATERIAL_QUARTZ,
      b.MATERIAL_IRON,
      b.MATERIAL_NETHERITE,
      b.MATERIAL_REDSTONE,
      b.MATERIAL_COPPER,
      b.MATERIAL_GOLD,
      b.MATERIAL_EMERALD,
      b.MATERIAL_DIAMOND,
      b.MATERIAL_LAPIS,
      b.MATERIAL_AMETHYST,
      b.OBFUSCATED,
      b.BOLD,
      b.ITALIC,
      b.RESET,
    ]),
    g(b, 'ALL_COLORS', [
      b.BLACK,
      b.DARK_BLUE,
      b.DARK_GREEN,
      b.DARK_AQUA,
      b.DARK_RED,
      b.DARK_PURPLE,
      b.GOLD,
      b.GRAY,
      b.DARK_GRAY,
      b.BLUE,
      b.GREEN,
      b.AQUA,
      b.RED,
      b.LIGHT_PURPLE,
      b.YELLOW,
      b.WHITE,
      b.MINECOIN_GOLD,
      b.MATERIAL_QUARTZ,
      b.MATERIAL_IRON,
      b.MATERIAL_NETHERITE,
      b.MATERIAL_REDSTONE,
      b.MATERIAL_COPPER,
      b.MATERIAL_GOLD,
      b.MATERIAL_EMERALD,
      b.MATERIAL_DIAMOND,
      b.MATERIAL_LAPIS,
      b.MATERIAL_AMETHYST,
    ]),
    g(b, 'PREFIX', '\xA7'),
    b),
  Je,
  ou =
    ((Je = class {
      constructor() {
        g(this, 'OpenObject', '{');
        g(this, 'CloseObject', '}');
        g(this, 'OpenArray', '[');
        g(this, 'CloseArray', ']');
        g(this, 'Comma', ',');
        g(this, 'KeyValueSeparator', ':');
        g(this, 'StringDelimiter', '"');
        g(this, 'KeyDelimiter', '');
        g(this, 'Indent', '  ');
        g(
          this,
          'NewLine',
          `
`,
        );
        g(this, 'Space', ' ');
        g(this, 'InlineThreshold', 60);
        g(this, 'MaxDepth', 1);
        g(this, 'IncludeClassNames', !0);
        g(this, 'FunctionValue', '\u0192');
        g(this, 'NullValue', 'null');
        g(this, 'UndefinedValue', 'undefined');
        g(this, 'TrueValue', 'true');
        g(this, 'FalseValue', 'false');
        g(this, 'CycleValue', '[...cycle...]');
        g(this, 'TruncatedObjectValue', '{...}');
        g(this, 'OpenCloseObjectColor', L.YELLOW);
        g(this, 'OpenCloseArrayColor', L.AQUA);
        g(this, 'NumberColor', L.DARK_AQUA);
        g(this, 'StringColor', L.DARK_GREEN);
        g(this, 'BooleanColor', L.GOLD);
        g(this, 'NullColor', L.GOLD);
        g(this, 'KeyColor', L.GRAY);
        g(this, 'EscapeColor', L.GOLD);
        g(this, 'FunctionColor', L.GRAY);
        g(this, 'ClassColor', L.GRAY);
        g(this, 'ClassStyle', L.BOLD);
        g(this, 'CycleColor', L.DARK_RED);
      }
      static createPlain() {
        let r = new Je();
        return (
          (r.OpenCloseObjectColor = ''),
          (r.OpenCloseArrayColor = ''),
          (r.NumberColor = ''),
          (r.StringColor = ''),
          (r.BooleanColor = ''),
          (r.NullColor = ''),
          (r.KeyColor = ''),
          (r.EscapeColor = ''),
          (r.FunctionColor = ''),
          (r.ClassColor = ''),
          (r.ClassStyle = ''),
          (r.CycleColor = ''),
          r
        );
      }
      stringify(r) {
        return this.stringifyValue(r, { indentLevel: 0, visited: new WeakSet() });
      }
      stringifyString(r) {
        return (
          this.StringColor +
          this.StringDelimiter +
          this.escapeString(r) +
          this.StringDelimiter +
          L.RESET
        );
      }
      stringifyNumber(r) {
        return this.NumberColor + r.toString() + L.RESET;
      }
      stringifyBoolean(r) {
        return this.BooleanColor + (r ? this.TrueValue : this.FalseValue) + L.RESET;
      }
      stringifyFunction(r) {
        return this.FunctionColor + this.FunctionValue + L.RESET;
      }
      stringifyNull() {
        return this.NullColor + this.NullValue + L.RESET;
      }
      stringifyUndefined() {
        return this.NullColor + this.UndefinedValue + L.RESET;
      }
      stringifyCycle() {
        return this.CycleColor + this.CycleValue + L.RESET;
      }
      stringifyArray(r, t) {
        let n = this.Indent.repeat(t.indentLevel);
        if (r.length === 0)
          return this.OpenCloseArrayColor + this.OpenArray + this.CloseArray + L.RESET;
        let o = this.OpenCloseArrayColor + this.OpenArray + L.RESET + this.NewLine,
          i = this.OpenCloseArrayColor + this.OpenArray + L.RESET;
        return (
          r.forEach((a, u) => {
            ((o += n + this.Indent + this.stringifyValue(a, this.indent(t))),
              (o += u < r.length - 1 ? this.Comma + this.NewLine : this.NewLine),
              (i += this.stringifyValue(a, this.indent(t))),
              (i += u < r.length - 1 ? this.Comma + this.Space : ''));
          }),
          (o += n + this.OpenCloseArrayColor + this.CloseArray + L.RESET),
          (i += this.OpenCloseArrayColor + this.CloseArray + L.RESET),
          i.length < this.InlineThreshold ? i : o
        );
      }
      stringifyTruncatedObject(r, t, n) {
        return (
          (this.IncludeClassNames
            ? this.ClassColor + '' + this.ClassStyle + t + L.RESET + this.Space
            : '') + this.TruncatedObjectValue
        );
      }
      stringifyObject(r, t, n, o) {
        let i = this.Indent.repeat(o.indentLevel),
          a =
            this.IncludeClassNames && t !== 'Object'
              ? this.ClassColor + '' + this.ClassStyle + t + L.RESET + this.Space
              : '';
        if (n.length === 0)
          return a + this.OpenCloseObjectColor + this.OpenObject + this.CloseObject + L.RESET;
        let u = a + this.OpenCloseObjectColor + this.OpenObject + L.RESET + this.NewLine,
          _ = a + this.OpenCloseObjectColor + this.OpenObject + L.RESET;
        return (
          n.forEach(([s, c], p) => {
            let w = this.stringifyValue(c, this.indent(o));
            ((u +=
              i +
              this.Indent +
              this.KeyColor +
              this.KeyDelimiter +
              s +
              this.KeyDelimiter +
              L.RESET +
              this.KeyValueSeparator +
              this.Space +
              w),
              (u += p < n.length - 1 ? this.Comma + this.NewLine : this.NewLine),
              (_ += this.KeyColor + s + L.RESET + this.KeyValueSeparator + this.Space + w),
              (_ += p < n.length - 1 ? this.Comma + this.Space : ''));
          }),
          (u += i + this.OpenCloseObjectColor + this.CloseObject + L.RESET),
          (_ += this.OpenCloseObjectColor + this.CloseObject + L.RESET),
          _.length < this.InlineThreshold ? _ : u
        );
      }
      shouldTruncateObject(r, t, n) {
        return !(t === 'Object' || n.indentLevel <= this.MaxDepth || this.MaxDepth <= 0);
      }
      stringifyValue(r, t) {
        if (r === null) return this.stringifyNull();
        if (r === void 0) return this.stringifyUndefined();
        if (typeof r == 'number') return this.stringifyNumber(r);
        if (typeof r == 'string') return this.stringifyString(r);
        if (typeof r == 'boolean') return this.stringifyBoolean(r);
        if (typeof r == 'function') return this.stringifyFunction(r);
        if (this.isCycle(r, t)) return this.stringifyCycle();
        if ((this.markCycle(r, t), Array.isArray(r))) {
          let n = this.stringifyArray(r, t.indentLevel ? this.indent(t) : t);
          return (this.clearCycle(r, t), n);
        }
        if (typeof r == 'object') {
          let n = r.constructor.name;
          if (this.shouldTruncateObject(r, n, t)) {
            let o = this.stringifyTruncatedObject(r, n, t);
            return (this.clearCycle(r, t), o);
          } else {
            let o = new Set(),
              i = Object.getPrototypeOf(r),
              a = Object.keys(i);
            for (; a.length > 0; )
              (a.forEach((c) => o.add(c)), (i = Object.getPrototypeOf(i)), (a = Object.keys(i)));
            (Object.keys(r).forEach((c) => o.add(c)), o.delete('__cycleDetection__'));
            let _ = [...o]
                .sort()
                .map((c) => {
                  try {
                    return [c, r[c] ?? void 0];
                  } catch {
                    return [c, void 0];
                  }
                })
                .filter(([, c]) => typeof c != 'function' && c !== void 0),
              s = this.stringifyObject(r, n, _, t);
            return (this.clearCycle(r, t), s);
          }
        }
        return (this.clearCycle(r, t), L.RESET + r.toString());
      }
      escapeString(r) {
        return r
          .replace(/\\/g, this.EscapeColor + '\\\\' + this.StringColor)
          .replace(/"/g, this.EscapeColor + '\\"' + this.StringColor)
          .replace(/\n/g, this.EscapeColor + '\\n' + this.StringColor)
          .replace(/\r/g, this.EscapeColor + '\\r' + this.StringColor)
          .replace(/\t/g, this.EscapeColor + '\\t' + this.StringColor);
      }
      markCycle(r, t) {
        t.visited.add(r);
      }
      isCycle(r, t) {
        return t.visited.has(r);
      }
      clearCycle(r, t) {
        t.visited.delete(r);
      }
      indent(r) {
        return { ...r, indentLevel: r.indentLevel + 1 };
      }
    }),
    g(Je, 'DEFAULT', new Je()),
    g(Je, 'PLAIN', Je.createPlain()),
    Je),
  Xt = void 0;
try {
  Xt = globalSourceMapping;
} catch {}
var V,
  Ue =
    ((V = class {
      constructor(r, t, n = L.RESET) {
        ((this.level = r), (this.name = t), (this.color = n));
      }
      toString() {
        return this.color + this.name.toUpperCase() + L.RESET;
      }
      static parse(r) {
        r = r.toLowerCase();
        for (let n of V.values) if (n.name === r) return n;
        let t = parseInt(r);
        if (!isNaN(t)) {
          for (let n of V.values) if (n.level === t) return n;
        }
      }
    }),
    g(V, 'All', new V(-2, 'all')),
    g(V, 'Trace', new V(-2, 'trace', L.DARK_AQUA)),
    g(V, 'Debug', new V(-1, 'debug', L.AQUA)),
    g(V, 'Info', new V(0, 'info', L.GREEN)),
    g(V, 'Warn', new V(1, 'warn', L.GOLD)),
    g(V, 'Error', new V(2, 'error', L.RED)),
    g(V, 'Fatal', new V(3, 'fatal', L.DARK_RED)),
    g(V, 'Off', new V(100, 'off')),
    g(V, 'values', [V.All, V.Trace, V.Debug, V.Info, V.Warn, V.Error, V.Fatal, V.Off]),
    V);
var Ve = {
    level: Ue.Info,
    filter: ['*'],
    outputTags: !1,
    timestampFormatter: (e) => '',
    formatFunction: (e, r, t, n, o = void 0) => {
      let i = o !== void 0 ? `\xA77${o.map((u) => `[${u}]`).join('')}\xA7r` : '';
      return `${n ? `[${n}]` : ''}[${e}][${L.MATERIAL_EMERALD}${r.name}${L.RESET}]${i} ${t}`;
    },
    messagesJoinFunction: (e) => e.join(' '),
    jsonFormatter: ou.DEFAULT,
    outputConfig: {
      [Ue.Trace.level]: [0, 1],
      [Ue.Debug.level]: [0, 1],
      [Ue.Info.level]: [0, 1],
      [Ue.Warn.level]: [0, 1, 2],
      [Ue.Error.level]: [0, 1, 3],
      [Ue.Fatal.level]: [0, 1, 3],
    },
  },
  Xr,
  h =
    ((Xr = class {
      constructor(r, t = []) {
        ((this.name = r), (this.tags = t));
      }
      static init() {}
      static setLevel(r) {
        Ve.level = r;
      }
      static setFilter(r) {
        Ve.filter = r;
      }
      static setFormatFunction(r) {
        Ve.formatFunction = r;
      }
      static setMessagesJoinFunction(r) {
        Ve.messagesJoinFunction = r;
      }
      static setTagsOutputVisibility(r) {
        Ve.outputTags = r;
      }
      static setTimestampFormatter(r) {
        Ve.timestampFormatter = r;
      }
      static setBasicTimestampFormatter() {
        Ve.timestampFormatter = (r) => {
          let t = r.getHours().toString().padStart(2, '0'),
            n = r.getMinutes().toString().padStart(2, '0'),
            o = r.getSeconds().toString().padStart(2, '0'),
            i = Math.floor(r.getMilliseconds() / 10)
              .toString()
              .padStart(2, '0');
          return `${t}:${n}:${o}.${i}`;
        };
      }
      static setJsonFormatter(r) {
        Ve.jsonFormatter = r;
      }
      static getOutputConfig() {
        return Ve.outputConfig;
      }
      static getLogger(r, ...t) {
        return new Xr(r, t);
      }
      log(r, ...t) {}
      stringifyError(r) {
        let t = r.stack ?? '';
        if (Xt) {
          let n = /\(([^)]+\.js):(\d+)(?::(\d+))?\)/;
          t = t
            .split(
              `
`,
            )
            .map((o) => {
              let i = n.exec(o);
              if (i) {
                let a = i[1],
                  u = parseInt(i[2], 10) - Xt.metadata.offset;
                if (a.includes(Xt.metadata.filePath)) {
                  let _ = globalSourceMapping[u];
                  if (_) {
                    let s = `(${_.source}:${_.originalLine})`;
                    return o.replace(n, s);
                  }
                }
              }
              return o;
            }).join(`
`);
        }
        return `${L.DARK_RED}${L.BOLD}${r.message}
${L.RESET}${L.GRAY}${L.ITALIC}${t}${L.RESET}`;
      }
      logRaw(r, ...t) {}
      trace(...r) {}
      debug(...r) {}
      info(...r) {}
      warn(...r) {}
      error(...r) {}
      fatal(...r) {}
    }),
    g(Xr, 'initialized', !1),
    Xr),
  k,
  f =
    ((k = class {
      constructor(r, t, n) {
        g(this, 'x');
        g(this, 'y');
        g(this, 'z');
        if (r === J.Down) ((this.x = 0), (this.y = -1), (this.z = 0));
        else if (r === J.Up) ((this.x = 0), (this.y = 1), (this.z = 0));
        else if (r === J.North) ((this.x = 0), (this.y = 0), (this.z = -1));
        else if (r === J.South) ((this.x = 0), (this.y = 0), (this.z = 1));
        else if (r === J.East) ((this.x = 1), (this.y = 0), (this.z = 0));
        else if (r === J.West) ((this.x = -1), (this.y = 0), (this.z = 0));
        else if (typeof r == 'number') ((this.x = r), (this.y = t), (this.z = n));
        else if (Array.isArray(r)) ((this.x = r[0]), (this.y = r[1]), (this.z = r[2]));
        else if (r instanceof k) ((this.x = r.x), (this.y = r.y), (this.z = r.z));
        else {
          if (!r || (!r.x && r.x !== 0) || (!r.y && r.y !== 0) || (!r.z && r.z !== 0))
            throw (k.log.error(new Error('Invalid vector'), r), new Error('Invalid vector'));
          ((this.x = r.x), (this.y = r.y), (this.z = r.z));
        }
      }
      static from(r, t, n) {
        if (r instanceof k) return r;
        if (typeof r == 'number' && t !== void 0 && n !== void 0) return new k(r, t, n);
        if (Array.isArray(r)) return new k(r);
        if (r === J.Down) return k.Down;
        if (r === J.Up) return k.Up;
        if (r === J.North) return k.North;
        if (r === J.South) return k.South;
        if (r === J.East) return k.East;
        if (r === J.West) return k.West;
        if (!r || (!r.x && r.x !== 0) || (!r.y && r.y !== 0) || (!r.z && r.z !== 0))
          throw (
            k.log.error(new Error('Invalid arguments'), r, t, n),
            new Error('Invalid arguments')
          );
        return new k(r.x, r.y, r.z);
      }
      static _from(r, t, n) {
        if (r instanceof k) return r;
        if (typeof r == 'number' && t !== void 0 && n !== void 0) return new k(r, t, n);
        if (Array.isArray(r)) return new k(r);
        if (r === J.Down) return k.Down;
        if (r === J.Up) return k.Up;
        if (r === J.North) return k.North;
        if (r === J.South) return k.South;
        if (r === J.East) return k.East;
        if (r === J.West) return k.West;
        if (!r || (!r.x && r.x !== 0) || (!r.y && r.y !== 0) || (!r.z && r.z !== 0))
          throw (
            k.log.error(new Error('Invalid arguments'), r, t, n),
            new Error('Invalid arguments')
          );
        return new k(r.x, r.y, r.z);
      }
      copy() {
        return new k(this.x, this.y, this.z);
      }
      toMutable() {
        return new nu(this.x, this.y, this.z);
      }
      static fromRotation(r, t) {
        let n;
        typeof r == 'number' ? ((n = r), (t = t)) : ((n = r.y), (t = r.x));
        let o = n * (Math.PI / 180),
          i = t * (Math.PI / 180),
          a = -Math.cos(i) * Math.sin(o),
          u = -Math.sin(i),
          _ = Math.cos(i) * Math.cos(o);
        return new k(a, u, _);
      }
      toRotation() {
        if (this.isZero())
          throw (
            k.log.error(new Error('Cannot convert zero-length vector to direction')),
            new Error('Cannot convert zero-length vector to direction')
          );
        let r = this.normalize(),
          t = -Math.atan2(r.x, r.z) * (180 / Math.PI);
        return { x: Math.asin(-r.y) * (180 / Math.PI), y: t };
      }
      add(r, t, n) {
        let o = k._from(r, t, n);
        return k.from(o.x + this.x, o.y + this.y, o.z + this.z);
      }
      subtract(r, t, n) {
        let o = k._from(r, t, n);
        return k.from(this.x - o.x, this.y - o.y, this.z - o.z);
      }
      multiply(r, t, n) {
        if (typeof r == 'number' && t === void 0 && n === void 0)
          return k.from(this.x * r, this.y * r, this.z * r);
        let o = k._from(r, t, n);
        return k.from(o.x * this.x, o.y * this.y, o.z * this.z);
      }
      scale(r) {
        return k.from(this.x * r, this.y * r, this.z * r);
      }
      divide(r, t, n) {
        if (typeof r == 'number' && t === void 0 && n === void 0) {
          if (r === 0) throw new Error('Cannot divide by zero');
          return k.from(this.x / r, this.y / r, this.z / r);
        }
        let o = k._from(r, t, n);
        if (o.x === 0 || o.y === 0 || o.z === 0) throw new Error('Cannot divide by zero');
        return k.from(this.x / o.x, this.y / o.y, this.z / o.z);
      }
      normalize() {
        if (this.isZero())
          throw (
            k.log.error(new Error('Cannot normalize zero-length vector')),
            new Error('Cannot normalize zero-length vector')
          );
        let r = this.length();
        return k.from(this.x / r, this.y / r, this.z / r);
      }
      length() {
        return Math.hypot(this.x, this.y, this.z);
      }
      lengthSquared() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
      }
      cross(r, t, n) {
        let o = k._from(r, t, n);
        return k.from(
          this.y * o.z - this.z * o.y,
          this.z * o.x - this.x * o.z,
          this.x * o.y - this.y * o.x,
        );
      }
      distance(r, t, n) {
        let o = k._from(r, t, n);
        return this.subtract(o).length();
      }
      distanceSquared(r, t, n) {
        let o = k._from(r, t, n);
        return this.subtract(o).lengthSquared();
      }
      lerp(r, t) {
        return !r || !t
          ? k.from(this)
          : t === 1
            ? k.from(r)
            : t === 0
              ? k.from(this)
              : k.from(
                  this.x + (r.x - this.x) * t,
                  this.y + (r.y - this.y) * t,
                  this.z + (r.z - this.z) * t,
                );
      }
      slerp(r, t) {
        if (!r || !t) return k.from(this);
        if (t === 1) return k.from(r);
        if (t === 0) return k.from(this);
        let n = this.dot(r),
          o = Math.acos(n) * t,
          i = k.from(r).subtract(this.multiply(n)).normalize();
        return this.multiply(Math.cos(o)).add(i.multiply(Math.sin(o)));
      }
      dot(r, t, n) {
        let o = k._from(r, t, n);
        return this.x * o.x + this.y * o.y + this.z * o.z;
      }
      angleBetween(r, t, n) {
        let o = k._from(r, t, n),
          i = this.dot(o),
          a = this.lengthSquared();
        if (a === 0) return 0;
        let u = o.lengthSquared();
        if (u === 0) return 0;
        let _ = Math.sqrt(a * u),
          s = Math.min(1, Math.max(-1, i / _));
        return Math.acos(s);
      }
      projectOnto(r, t, n) {
        let o = k._from(r, t, n);
        if (o.isZero()) return k.Zero;
        let i = o.dot(o);
        if (i === 0) return k.Zero;
        let a = this.dot(o) / i;
        return k.from(o.x * a, o.y * a, o.z * a);
      }
      reflect(r, t, n) {
        let o = k._from(r, t, n),
          i = this.projectOnto(o);
        return this.subtract(i.multiply(2));
      }
      rotate(r, t) {
        let n = (t * Math.PI) / 180 / 2,
          o = Math.cos(n),
          i = r.x * Math.sin(n),
          a = r.y * Math.sin(n),
          u = r.z * Math.sin(n),
          _ = this,
          s =
            o * o * _.x +
            2 * a * o * _.z -
            2 * u * o * _.y +
            i * i * _.x +
            2 * a * i * _.y +
            2 * u * i * _.z -
            u * u * _.x -
            a * a * _.x,
          c =
            2 * i * a * _.x +
            a * a * _.y +
            2 * u * a * _.z +
            2 * o * u * _.x -
            u * u * _.y +
            o * o * _.y -
            2 * i * o * _.z -
            i * i * _.y,
          p =
            2 * i * u * _.x +
            2 * a * u * _.y +
            u * u * _.z -
            2 * o * a * _.x -
            a * a * _.z +
            2 * o * i * _.y -
            i * i * _.z +
            o * o * _.z;
        return new k(s, c, p);
      }
      update(r, t, n) {
        return (
          r || (r = (o) => o),
          t || (t = (o) => o),
          n || (n = (o) => o),
          new k(r(this.x), t(this.y), n(this.z))
        );
      }
      setX(r) {
        return typeof r == 'number' ? new k(r, this.y, this.z) : new k(r(this.x), this.y, this.z);
      }
      setY(r) {
        return typeof r == 'number' ? new k(this.x, r, this.z) : new k(this.x, r(this.y), this.z);
      }
      setZ(r) {
        return typeof r == 'number' ? new k(this.x, this.y, r) : new k(this.x, this.y, r(this.z));
      }
      distanceToLineSegment(r, t) {
        let n = k.from(t).subtract(r);
        if (n.lengthSquared() === 0) return this.subtract(r).length();
        let o = Math.max(0, Math.min(1, this.subtract(r).dot(n) / n.dot(n))),
          i = k.from(r).add(n.multiply(o));
        return this.subtract(i).length();
      }
      floor() {
        return this.update(Math.floor, Math.floor, Math.floor);
      }
      floorX() {
        return this.setX(Math.floor);
      }
      floorY() {
        return this.setY(Math.floor);
      }
      floorZ() {
        return this.setZ(Math.floor);
      }
      ceil() {
        return new k(Math.ceil(this.x), Math.ceil(this.y), Math.ceil(this.z));
      }
      ceilX() {
        return this.setX(Math.ceil);
      }
      ceilY() {
        return this.setY(Math.ceil);
      }
      ceilZ() {
        return this.setZ(Math.ceil);
      }
      round() {
        return this.update(Math.round, Math.round, Math.round);
      }
      roundX() {
        return this.setX(Math.round);
      }
      roundY() {
        return this.setY(Math.round);
      }
      roundZ() {
        return this.setZ(Math.round);
      }
      up() {
        return this.add(k.Up);
      }
      down() {
        return this.add(k.Down);
      }
      north() {
        return this.add(k.North);
      }
      south() {
        return this.add(k.South);
      }
      east() {
        return this.add(k.East);
      }
      west() {
        return this.add(k.West);
      }
      isZero() {
        return this.x === 0 && this.y === 0 && this.z === 0;
      }
      toArray() {
        return [this.x, this.y, this.z];
      }
      toDirection() {
        if (this.isZero())
          throw (
            k.log.error(new Error('Cannot convert zero-length vector to direction')),
            new Error('Cannot convert zero-length vector to direction')
          );
        let r = this.normalize(),
          t = Math.max(Math.abs(r.x), Math.abs(r.y), Math.abs(r.z));
        if (t === r.x) return J.East;
        if (t === -r.x) return J.West;
        if (t === r.y) return J.Up;
        if (t === -r.y) return J.Down;
        if (t === r.z) return J.South;
        if (t === -r.z) return J.North;
        throw (
          k.log.error(new Error('Cannot convert vector to direction'), this),
          new Error('Cannot convert vector to direction')
        );
      }
      toStructureRotation() {
        let r = this.toRotation(),
          t = Math.round(r.y / 90) * 90;
        if ((t < 0 && (t += 360), t >= 360 && (t -= 360), t === 0)) return jt.None;
        if (t === 90) return jt.Rotate90;
        if (t === 180) return jt.Rotate180;
        if (t === 270) return jt.Rotate270;
        throw (
          k.log.error(new Error('Cannot convert vector to structure rotation'), this),
          new Error('Cannot convert vector to structure rotation')
        );
      }
      toBlockLocation() {
        return k.from(
          (this.x << 0) - (this.x < 0 && this.x !== this.x << 0 ? 1 : 0),
          (this.y << 0) - (this.y < 0 && this.y !== this.y << 0 ? 1 : 0),
          (this.z << 0) - (this.z < 0 && this.z !== this.z << 0 ? 1 : 0),
        );
      }
      almostEqual(r, t, n, o) {
        try {
          let i;
          return (
            typeof r != 'number' && n === void 0
              ? ((i = k._from(r, void 0, void 0)), (o = t))
              : (i = k._from(r, t, n)),
            Math.abs(this.x - i.x) <= o &&
              Math.abs(this.y - i.y) <= o &&
              Math.abs(this.z - i.z) <= o
          );
        } catch {
          return !1;
        }
      }
      equals(r, t, n) {
        try {
          let o = k._from(r, t, n);
          return this.x === o.x && this.y === o.y && this.z === o.z;
        } catch {
          return !1;
        }
      }
      toString(r = 'long', t = ', ') {
        let n = `${this.x + t + this.y + t + this.z}`;
        return r === 'long' ? `Vec3(${n})` : n;
      }
      static fromString(r, t = 'long', n = ', ') {
        if (t === 'long') {
          let o = r.match(/^Vec3\((.*)\)$/);
          if (!o) throw new Error('Invalid string format');
          let i = o[1].split(n);
          if (i.length !== 3) throw new Error('Invalid string format');
          return k.from(Number(i[0]), Number(i[1]), Number(i[2]));
        } else {
          let o = r.split(n);
          if (o.length !== 3) throw new Error('Invalid string format');
          return k.from(Number(o[0]), Number(o[1]), Number(o[2]));
        }
      }
    }),
    g(k, 'log', h.getLogger('vec3', 'vec3', 'bedrock-boost')),
    g(k, 'Zero', new k(0, 0, 0)),
    g(k, 'Down', new k(J.Down)),
    g(k, 'Up', new k(J.Up)),
    g(k, 'North', new k(J.North)),
    g(k, 'South', new k(J.South)),
    g(k, 'East', new k(J.East)),
    g(k, 'West', new k(J.West)),
    k),
  Ut = class H {
    constructor(r, t) {
      g(this, 'x');
      g(this, 'y');
      if (r === j.Down || r === j.Up) throw new Error('Invalid direction');
      if (r === j.North) ((this.x = 0), (this.y = 1));
      else if (r === j.South) ((this.x = 0), (this.y = -1));
      else if (r === j.East) ((this.x = 1), (this.y = 0));
      else if (r === j.West) ((this.x = -1), (this.y = 0));
      else if (typeof r == 'number') {
        if (t === void 0) throw new Error('Invalid vector');
        ((this.x = r), (this.y = t));
      } else if (Array.isArray(r)) ((this.x = r[0]), (this.y = r[1]));
      else if (r instanceof H || r instanceof Jt) ((this.x = r.x), (this.y = r.y));
      else {
        let n = r;
        if (!n || (!n.x && n.x !== 0) || (!n.y && n.y !== 0 && !n.z && n.z !== 0))
          throw new Error('Invalid vector');
        if (((this.x = n.x), n.y || n.y === 0)) this.y = n.y;
        else if (n.z || n.z === 0) this.y = n.z;
        else throw new Error('Invalid vector');
      }
    }
    static from(r, t) {
      if (r instanceof H) return new H(r);
      if (r instanceof Jt) return new H(r);
      if (typeof r == 'number' && t !== void 0) return new H(r, t);
      if (Array.isArray(r)) return new H(r);
      if (r === j.Down || r === j.Up) throw new Error('Invalid direction');
      return r === j.North
        ? new H(j.North)
        : r === j.South
          ? new H(j.South)
          : r === j.East
            ? new H(j.East)
            : r === j.West
              ? new H(j.West)
              : new H(r, t);
    }
    static _from(r, t) {
      if (r instanceof H) return r;
      if (r instanceof Jt) return new H(r);
      if (typeof r == 'number' && t !== void 0) return new H(r, t);
      if (Array.isArray(r)) return new H(r);
      if (r === j.Down || r === j.Up) throw new Error('Invalid direction');
      return r === j.North
        ? new H(j.North)
        : r === j.South
          ? new H(j.South)
          : r === j.East
            ? new H(j.East)
            : r === j.West
              ? new H(j.West)
              : new H(r, t);
    }
    copy() {
      return new H(this.x, this.y);
    }
    toImmutable() {
      return new Jt(this.x, this.y);
    }
    static fromYaw(r) {
      let t = r * (Math.PI / 180),
        n = Math.sin(t),
        o = Math.cos(t);
      return new H(n, o);
    }
    toYaw() {
      if (this.isZero()) throw new Error('Cannot convert zero-length vector to direction');
      let r = this.copy().normalize();
      return Math.atan2(r.x, r.y) * (180 / Math.PI);
    }
    add(r, t) {
      let n = H._from(r, t);
      return ((this.x += n.x), (this.y += n.y), this);
    }
    subtract(r, t) {
      let n = H._from(r, t);
      return ((this.x -= n.x), (this.y -= n.y), this);
    }
    multiply(r, t) {
      if (typeof r == 'number' && t === void 0) return ((this.x *= r), (this.y *= r), this);
      let n = H._from(r, t);
      return ((this.x *= n.x), (this.y *= n.y), this);
    }
    scale(r) {
      return ((this.x *= r), (this.y *= r), this);
    }
    divide(r, t) {
      if (typeof r == 'number' && t === void 0) {
        if (r === 0) throw new Error('Cannot divide by zero');
        return ((this.x /= r), (this.y /= r), this);
      }
      let n = H._from(r, t);
      if (n.x === 0 || n.y === 0) throw new Error('Cannot divide by zero');
      return ((this.x /= n.x), (this.y /= n.y), this);
    }
    normalize() {
      if (this.isZero()) throw new Error('Cannot normalize zero-length vector');
      let r = this.length();
      return ((this.x /= r), (this.y /= r), this);
    }
    length() {
      return Math.hypot(this.x, this.y);
    }
    lengthSquared() {
      return this.x * this.x + this.y * this.y;
    }
    distance(r, t) {
      let n = H._from(r, t);
      return this.copy().subtract(n).length();
    }
    distanceSquared(r, t) {
      let n = H._from(r, t);
      return this.copy().subtract(n).lengthSquared();
    }
    lerp(r, t) {
      return !r || t === void 0
        ? this
        : t === 1
          ? ((this.x = r.x), (this.y = r.y), this)
          : t === 0
            ? this
            : ((this.x = this.x + (r.x - this.x) * t),
              (this.y = this.y + (r.y - this.y) * t),
              this);
    }
    slerp(r, t) {
      if (!r || t === void 0) return this;
      if (t === 1) return ((this.x = r.x), (this.y = r.y), this);
      if (t === 0) return this;
      let n = this.dot(r),
        o = Math.acos(n) * t,
        i = H.from(r).subtract(this.copy().multiply(n)).normalize(),
        a = Math.cos(o),
        u = Math.sin(o);
      return (this.multiply(a), (this.x += i.x * u), (this.y += i.y * u), this);
    }
    dot(r, t) {
      let n = H._from(r, t);
      return this.x * n.x + this.y * n.y;
    }
    angleBetween(r, t) {
      let n = H._from(r, t),
        o = this.dot(n),
        i = this.length() * n.length();
      return i === 0 ? 0 : Math.acos(o / i);
    }
    projectOnto(r, t) {
      let n = H._from(r, t);
      if (n.isZero()) return ((this.x = 0), (this.y = 0), this);
      let o = this.dot(n) / n.dot(n);
      return ((this.x = n.x * o), (this.y = n.y * o), this);
    }
    reflect(r, t) {
      let n = H._from(r, t),
        o = this.copy().projectOnto(n);
      return this.subtract(o.multiply(2));
    }
    toVec3(r) {
      return new f(this.x, this.y, r || 0);
    }
    setX(r) {
      return (typeof r == 'number' ? (this.x = r) : (this.x = r(this.x)), this);
    }
    setY(r) {
      return (typeof r == 'number' ? (this.y = r) : (this.y = r(this.y)), this);
    }
    update(r, t) {
      return (
        r || (r = (n) => n),
        t || (t = (n) => n),
        (this.x = r(this.x)),
        (this.y = t(this.y)),
        this
      );
    }
    floor() {
      return this.update(Math.floor, Math.floor);
    }
    floorX() {
      return this.setX(Math.floor);
    }
    floorY() {
      return this.setY(Math.floor);
    }
    ceil() {
      return this.update(Math.ceil, Math.ceil);
    }
    ceilX() {
      return this.setX(Math.ceil);
    }
    ceilY() {
      return this.setY(Math.ceil);
    }
    round() {
      return this.update(Math.round, Math.round);
    }
    roundX() {
      return this.setX(Math.round);
    }
    roundY() {
      return this.setY(Math.round);
    }
    north() {
      return this.add(j.North);
    }
    south() {
      return this.add(j.South);
    }
    east() {
      return this.add(j.East);
    }
    west() {
      return this.add(j.West);
    }
    isZero() {
      return this.x === 0 && this.y === 0;
    }
    toArray() {
      return [this.x, this.y];
    }
    toDirection() {
      if (this.isZero()) throw new Error('Cannot convert zero-length vector to direction');
      let r = this.copy().normalize(),
        t = Math.max(Math.abs(r.x), Math.abs(r.y));
      if (t === r.x) return j.East;
      if (t === -r.x) return j.West;
      if (t === r.y) return j.North;
      if (t === -r.y) return j.South;
      throw new Error('Cannot convert vector to direction');
    }
    toBlockLocation() {
      let r = (this.x << 0) - (this.x < 0 && this.x !== this.x << 0 ? 1 : 0),
        t = (this.y << 0) - (this.y < 0 && this.y !== this.y << 0 ? 1 : 0);
      return ((this.x = r), (this.y = t), this);
    }
    almostEqual(r, t, n) {
      try {
        let o;
        return (
          typeof r != 'number' && n === void 0
            ? ((o = H._from(r, void 0)), (n = t))
            : (o = H._from(r, t)),
          Math.abs(this.x - o.x) <= n && Math.abs(this.y - o.y) <= n
        );
      } catch {
        return !1;
      }
    }
    equals(r, t) {
      try {
        let n = H._from(r, t);
        return this.x === n.x && this.y === n.y;
      } catch {
        return !1;
      }
    }
    toString(r = 'long', t = ', ') {
      let n = `${this.x + t + this.y}`;
      return r === 'long' ? `MutVec2(${n})` : n;
    }
  },
  S,
  Jt =
    ((S = class {
      constructor(r, t) {
        g(this, 'x');
        g(this, 'y');
        if (r === X.Down || r === X.Up)
          throw (S.log.error(new Error('Invalid direction'), r), new Error('Invalid direction'));
        if (r === X.North) ((this.x = 0), (this.y = 1));
        else if (r === X.South) ((this.x = 0), (this.y = -1));
        else if (r === X.East) ((this.x = 1), (this.y = 0));
        else if (r === X.West) ((this.x = -1), (this.y = 0));
        else if (typeof r == 'number') ((this.x = r), (this.y = t));
        else if (Array.isArray(r)) ((this.x = r[0]), (this.y = r[1]));
        else if (r instanceof S) ((this.x = r.x), (this.y = r.y));
        else if (r instanceof Ut) ((this.x = r.x), (this.y = r.y));
        else if (r instanceof f) ((this.x = r.x), (this.y = r.y));
        else {
          let n = r;
          if (!n || (!n.x && n.x !== 0) || (!n.y && n.y !== 0 && !n.z && n.z !== 0))
            throw (S.log.error(new Error('Invalid vector'), r), new Error('Invalid vector'));
          if (((this.x = r.x), n.y || n.y === 0)) this.y = n.y;
          else if (n.z || n.z === 0) this.y = n.z;
          else throw (S.log.error(new Error('Invalid vector'), r), new Error('Invalid vector'));
        }
      }
      static from(r, t) {
        if (r instanceof S) return r;
        if (r instanceof Ut) return new S(r.x, r.y);
        if (typeof r == 'number' && t !== void 0) return new S(r, t);
        if (Array.isArray(r)) return new S(r);
        if (r === X.Down || r === X.Up)
          throw (S.log.error(new Error('Invalid direction'), r), new Error('Invalid direction'));
        return r === X.North
          ? S.North
          : r === X.South
            ? S.South
            : r === X.East
              ? S.East
              : r === X.West
                ? S.West
                : new S(r, t);
      }
      static _from(r, t) {
        if (r instanceof S) return r;
        if (r instanceof Ut) return new S(r.x, r.y);
        if (typeof r == 'number' && t !== void 0) return new S(r, t);
        if (Array.isArray(r)) return new S(r);
        if (r === X.Down || r === X.Up)
          throw (S.log.error(new Error('Invalid direction'), r), new Error('Invalid direction'));
        return r === X.North
          ? S.North
          : r === X.South
            ? S.South
            : r === X.East
              ? S.East
              : r === X.West
                ? S.West
                : new S(r, t);
      }
      copy() {
        return new S(this.x, this.y);
      }
      toMutable() {
        return new Ut(this.x, this.y);
      }
      static fromYaw(r) {
        let t = r * (Math.PI / 180),
          n = Math.sin(t),
          o = Math.cos(t);
        return new S(n, o);
      }
      toYaw() {
        if (this.isZero())
          throw (
            S.log.error(new Error('Cannot convert zero-length vector to direction')),
            new Error('Cannot convert zero-length vector to direction')
          );
        let r = this.normalize();
        return Math.atan2(r.x, r.y) * (180 / Math.PI);
      }
      add(r, t) {
        let n = S._from(r, t);
        return S.from(n.x + this.x, n.y + this.y);
      }
      subtract(r, t) {
        let n = S._from(r, t);
        return S.from(this.x - n.x, this.y - n.y);
      }
      multiply(r, t) {
        if (typeof r == 'number' && t === void 0) return S.from(this.x * r, this.y * r);
        let n = S._from(r, t);
        return S.from(n.x * this.x, n.y * this.y);
      }
      scale(r) {
        return S.from(this.x * r, this.y * r);
      }
      divide(r, t) {
        if (typeof r == 'number' && t === void 0) {
          if (r === 0) throw new Error('Cannot divide by zero');
          return S.from(this.x / r, this.y / r);
        }
        let n = S._from(r, t);
        if (n.x === 0 || n.y === 0) throw new Error('Cannot divide by zero');
        return S.from(this.x / n.x, this.y / n.y);
      }
      normalize() {
        if (this.isZero())
          throw (
            S.log.error(new Error('Cannot normalize zero-length vector')),
            new Error('Cannot normalize zero-length vector')
          );
        let r = this.length();
        return S.from(this.x / r, this.y / r);
      }
      length() {
        return Math.sqrt(this.lengthSquared());
      }
      lengthSquared() {
        return this.x * this.x + this.y * this.y;
      }
      distance(r, t) {
        let n = S._from(r, t);
        return Math.sqrt(this.distanceSquared(n));
      }
      distanceSquared(r, t) {
        let n = S._from(r, t);
        return this.subtract(n).lengthSquared();
      }
      lerp(r, t) {
        return !r || !t
          ? S.from(this)
          : t === 1
            ? S.from(r)
            : t === 0
              ? S.from(this)
              : S.from(this.x + (r.x - this.x) * t, this.y + (r.y - this.y) * t);
      }
      slerp(r, t) {
        if (!r || !t) return S.from(this);
        if (t === 1) return S.from(r);
        if (t === 0) return S.from(this);
        let n = this.dot(r),
          o = Math.acos(n) * t,
          i = S.from(r).subtract(this.multiply(n)).normalize();
        return this.multiply(Math.cos(o)).add(i.multiply(Math.sin(o)));
      }
      dot(r, t) {
        let n = S._from(r, t);
        return this.x * n.x + this.y * n.y;
      }
      angleBetween(r, t) {
        let n = S._from(r, t),
          o = this.dot(n),
          i = this.length() * n.length();
        return i === 0 ? 0 : Math.acos(o / i);
      }
      projectOnto(r, t) {
        let n = S._from(r, t);
        return n.isZero() ? S.Zero : n.scale(this.dot(n) / n.dot(n));
      }
      reflect(r, t) {
        let n = S._from(r, t),
          o = this.projectOnto(n);
        return this.subtract(o.multiply(2));
      }
      toVec3(r) {
        return new f(this.x, this.y, r || 0);
      }
      setX(r) {
        return new S(r, this.y);
      }
      setY(r) {
        return new S(this.x, r);
      }
      distanceToLineSegment(r, t) {
        let n = S.from(t).subtract(r);
        if (n.lengthSquared() === 0) return this.subtract(r).length();
        let o = Math.max(0, Math.min(1, this.subtract(r).dot(n) / n.dot(n))),
          i = S.from(r).add(n.multiply(o));
        return this.subtract(i).length();
      }
      floor() {
        return new S(Math.floor(this.x), Math.floor(this.y));
      }
      floorX() {
        return new S(Math.floor(this.x), this.y);
      }
      floorY() {
        return new S(this.x, Math.floor(this.y));
      }
      ceil() {
        return new S(Math.ceil(this.x), Math.ceil(this.y));
      }
      ceilX() {
        return new S(Math.ceil(this.x), this.y);
      }
      ceilY() {
        return new S(this.x, Math.ceil(this.y));
      }
      round() {
        return new S(Math.round(this.x), Math.round(this.y));
      }
      roundX() {
        return new S(Math.round(this.x), this.y);
      }
      roundY() {
        return new S(this.x, Math.round(this.y));
      }
      north() {
        return this.add(S.North);
      }
      south() {
        return this.add(S.South);
      }
      east() {
        return this.add(S.East);
      }
      west() {
        return this.add(S.West);
      }
      isZero() {
        return this.x === 0 && this.y === 0;
      }
      toArray() {
        return [this.x, this.y];
      }
      toDirection() {
        if (this.isZero())
          throw (
            S.log.error(new Error('Cannot convert zero-length vector to direction')),
            new Error('Cannot convert zero-length vector to direction')
          );
        let r = this.normalize(),
          t = Math.max(Math.abs(r.x), Math.abs(r.y));
        if (t === r.x) return X.East;
        if (t === -r.x) return X.West;
        if (t === r.y) return X.North;
        if (t === -r.y) return X.South;
        throw (
          S.log.error(new Error('Cannot convert vector to direction'), this),
          new Error('Cannot convert vector to direction')
        );
      }
      toBlockLocation() {
        return S.from(
          (this.x << 0) - (this.x < 0 && this.x !== this.x << 0 ? 1 : 0),
          (this.y << 0) - (this.y < 0 && this.y !== this.y << 0 ? 1 : 0),
        );
      }
      almostEqual(r, t, n) {
        try {
          let o;
          return (
            typeof r != 'number' && n === void 0
              ? ((o = S._from(r, void 0)), (n = t))
              : (o = S._from(r, t)),
            Math.abs(this.x - o.x) <= n && Math.abs(this.y - o.y) <= n
          );
        } catch {
          return !1;
        }
      }
      equals(r, t) {
        try {
          let n = S._from(r, t);
          return this.x === n.x && this.y === n.y;
        } catch {
          return !1;
        }
      }
      toString(r = 'long', t = ', ') {
        let n = `${this.x + t + this.y}`;
        return r === 'long' ? `Vec2(${n})` : n;
      }
    }),
    g(S, 'log', h.getLogger('vec2', 'vec2', 'bedrock-boost')),
    g(S, 'Zero', new S(0, 0)),
    g(S, 'North', new S(X.North)),
    g(S, 'South', new S(X.South)),
    g(S, 'East', new S(X.East)),
    g(S, 'West', new S(X.West)),
    S),
  nr,
  bd =
    ((nr = class {
      static begin(r) {
        (this.end(), (this.lastTime = new Date().getTime()), (this.lastOperation = r));
      }
      static end() {
        let r = new Date().getTime();
        (this.lastTime > 0 &&
          nr.log.debug(`Operation ${this.lastOperation} took ${r - this.lastTime}ms`),
          (this.lastTime = -1));
      }
    }),
    g(nr, 'log', h.getLogger('Timings', 'timings')),
    g(nr, 'lastTime', -1),
    g(nr, 'lastOperation', ''),
    nr);
var Dn = {};
function Q(e, r) {
  let t = `${e}:${JSON.stringify(r)}`;
  return Dn[t] ? Dn[t] : (Dn[t] = iu.resolve(e, r));
}
function uu(e, r) {
  let { x: t, y: n, z: o } = r,
    i = e.getVelocity(),
    a = Math.sqrt(t * t + o * o),
    u = 0,
    _ = 0;
  a !== 0 && ((u = t / a), (_ = o / a));
  let s = a * 2.5,
    c = n + i.y * 0.9;
  e.applyKnockback({ x: s * u, z: s * _ }, c);
}
function _u(e) {
  let { x: r, z: t } = e.getVelocity(),
    n = Math.sqrt(r * r + t * t),
    o = 0,
    i = 0;
  (n !== 0 && ((o = -r / n), (i = -t / n)), e.applyKnockback({ x: n * o, z: n * i }, 0));
}
function lu() {
  ((Ho.prototype.applyImpulse = function (e) {
    uu(this, e);
  }),
    (Ho.prototype.clearVelocity = function () {
      _u(this);
    }));
}
var An,
  Vo =
    ((An = class {
      static installConsole() {
        this._installed.get('console') ||
          (this._installed.set('console', !0),
          (console.originalLog = console.log),
          (console.log = (...e) => {
            console.originalLog(...e);
            let r = e.join(' ');
            au.sendMessage(r);
          }));
      }
      static installPlayer() {
        this._installed.get('player') || (this._installed.set('player', !0), lu());
      }
    }),
    g(An, '_installed', new Map()),
    An),
  yd = h.getLogger('jobUtils', 'bedrock-boost', 'jobUtils');
var or,
  Uo =
    ((or = class {
      constructor(r, t) {
        g(this, 'items', []);
        g(this, 'period');
        g(this, 'currentTick', 0);
        g(this, 'runId');
        g(this, 'nextIndex', 0);
        g(this, 'executionSchedule', []);
        g(this, 'processor');
        if (t <= 0) throw new Error('Period must be a positive integer.');
        if (!r || typeof r != 'function') throw new Error('Processor function must be defined.');
        ((this.period = t), (this.processor = r));
      }
      remove(r) {
        r >= 0 &&
          r < this.items.length &&
          (this.items.splice(r, 1),
          r < this.nextIndex && this.nextIndex--,
          this.recalculateExecutionSchedule());
      }
      removeIf(r) {
        for (let t = this.items.length - 1; t >= 0; t--) r(this.items[t]) && this.remove(t);
      }
      getItems() {
        return this.items;
      }
      start() {
        (this.stop(),
          (this.currentTick = 0),
          (this.nextIndex = 0),
          (this.runId = Qo.runInterval(() => this.tick(), 1)));
      }
      stop() {
        this.runId !== void 0 && (Qo.clearRun(this.runId), (this.runId = void 0));
      }
      recalculateExecutionSchedule() {
        let r = this.items.length;
        if (((this.executionSchedule = new Array(this.period).fill(0)), r === 0)) return;
        let t = this.period / r;
        for (let n = 0; n < r; n++) this.executionSchedule[Math.round(t * n) % this.period]++;
      }
      tick() {
        if (this.items.length === 0) {
          or.log.trace('No items to process.');
          return;
        }
        let r = this.executionSchedule[this.currentTick];
        if (r === 0) {
          (or.log.trace('No items to process this tick.'),
            (this.currentTick = (this.currentTick + 1) % this.period),
            this.currentTick === 0 && (this.nextIndex = 0));
          return;
        }
        let t = 0;
        for (; this.nextIndex < this.items.length && t < r; this.nextIndex++) {
          try {
            this.processor(this.items[this.nextIndex]);
          } catch (n) {
            or.log.error('Error processing item', n);
          }
          t++;
        }
        ((this.currentTick = (this.currentTick + 1) % this.period),
          this.currentTick === 0 && (this.nextIndex = 0));
      }
      push(...r) {
        return (this.items.push(...r), this.recalculateExecutionSchedule(), this.items.length);
      }
      pop() {
        let r = this.items.pop();
        return (this.recalculateExecutionSchedule(), r);
      }
      shift() {
        let r = this.items.shift();
        return (this.recalculateExecutionSchedule(), r);
      }
      unshift(...r) {
        return (this.items.unshift(...r), this.recalculateExecutionSchedule(), this.items.length);
      }
      splice(r, t = 0, ...n) {
        let o = this.items.splice(r, t, ...n);
        return (this.recalculateExecutionSchedule(), o);
      }
    }),
    g(or, 'log', h.getLogger('PulseScheduler', 'bedrock-boost', 'pulse-scheduler')),
    or);
var Yr,
  Dd =
    ((Yr = class extends Uo {
      constructor(t, n, o) {
        super((i) => {
          i.isValid ? t(i) : this.removeIf((a) => !a.isValid);
        }, n);
        g(this, 'filteredScratch', []);
        ((this.queryOptions = o),
          this.push(...Jr.getDimension('minecraft:overworld').getEntities(this.queryOptions)),
          this.push(...Jr.getDimension('minecraft:nether').getEntities(this.queryOptions)),
          this.push(...Jr.getDimension('minecraft:the_end').getEntities(this.queryOptions)));
      }
      compareEntities(t, n) {
        return t.id === n.id;
      }
      start() {
        (Jr.afterEvents.entityLoad.subscribe((t) => {
          this.addIfMatchesWithRetry(t.entity);
        }),
          Jr.afterEvents.entitySpawn.subscribe((t) => {
            this.addIfMatchesWithRetry(t.entity);
          }),
          Jr.afterEvents.entityRemove.subscribe((t) => {
            this.removeIf((n) => !n.isValid || n.id === t.removedEntityId);
          }),
          super.start());
      }
      addIfMatchesWithRetry(t) {
        try {
          if (!t) return;
          if (t.isValid) t.matches(this.queryOptions) && this.push(t);
          else {
            let n,
              o = 0;
            n = jo.runInterval(() => {
              if ((o++, t.isValid)) {
                (jo.clearRun(n), t.matches(this.queryOptions) && this.push(t));
                return;
              }
              o >= 10 && jo.clearRun(n);
            }, 1);
          }
        } catch (n) {
          Yr.logger.debug('Failed to push entity to scheduler.', n);
        }
      }
      push(...t) {
        let n = this.filteredScratch;
        n.length = 0;
        for (let i of t) {
          if (!i.isValid) continue;
          let a = !1;
          for (let u of this.items)
            if (this.compareEntities(u, i)) {
              a = !0;
              break;
            }
          a || n.push(i);
        }
        let o = super.push(...n);
        return ((n.length = 0), o);
      }
      unshift(...t) {
        let n = this.filteredScratch;
        n.length = 0;
        for (let i of t) {
          if (!i.isValid) continue;
          let a = !1;
          for (let u of this.items)
            if (this.compareEntities(u, i)) {
              a = !0;
              break;
            }
          a || n.push(i);
        }
        let o = super.unshift(...n);
        return ((n.length = 0), o);
      }
      splice(t, n, ...o) {
        if (n === void 0) return super.splice(t);
        let i = this.filteredScratch;
        i.length = 0;
        for (let u of o) {
          let _ = !1;
          for (let s of this.items)
            if (this.compareEntities(s, u)) {
              _ = !0;
              break;
            }
          _ || i.push(u);
        }
        let a = super.splice(t, n, ...i);
        return ((i.length = 0), a);
      }
    }),
    g(Yr, 'logger', h.getLogger('EntityPulseScheduler', 'bedrock-boost', 'entity-pulse-scheduler')),
    Yr),
  Er,
  ir =
    ((Er = class extends Uo {
      constructor(r, t) {
        super((n) => {
          n.isValid ? r(n) : this.removeIf((o) => !o.isValid);
        }, t);
        try {
          this.push(...yt.getAllPlayers());
        } catch {
          Bn.runTimeout(() => {
            this.push(...yt.getAllPlayers());
          }, 1);
        }
      }
      compareEntities(r, t) {
        return r.id === t.id;
      }
      start() {
        (yt.afterEvents.playerJoin.subscribe((r) => {
          let t = 0,
            n = () => {
              if ((t++, t > 10)) {
                Er.logger.debug('Failed to push player to scheduler after 10 attempts.');
                return;
              }
              try {
                let o = yt.getEntity(r.playerId);
                (o === void 0 && Bn.runTimeout(n, 1), o instanceof su && this.push(o));
              } catch (o) {
                (Er.logger.debug('Failed to push player to scheduler.', o), Bn.runTimeout(n, 1));
              }
            };
          n();
        }),
          yt.afterEvents.playerLeave.subscribe((r) => {
            this.removeIf((t) => !t.isValid || t.id === r.playerId);
          }),
          super.start());
      }
      push(...r) {
        let t = r.filter((n) => n.isValid && !this.items.some((o) => this.compareEntities(o, n)));
        return super.push(...t);
      }
      unshift(...r) {
        let t = r.filter((n) => n.isValid && !this.items.some((o) => this.compareEntities(o, n)));
        return super.unshift(...t);
      }
      splice(r, t, ...n) {
        if (t === void 0) return super.splice(r);
        let o = n.filter((i) => !this.items.some((a) => this.compareEntities(a, i)));
        return super.splice(r, t, ...o);
      }
    }),
    g(Er, 'logger', h.getLogger('PlayerPulseScheduler', 'bedrock-boost', 'player-pulse-scheduler')),
    Er);
var Re,
  Fe =
    ((Re = class {}),
    g(Re, 'Opposites', {
      [v.Down]: v.Up,
      [v.Up]: v.Down,
      [v.North]: v.South,
      [v.South]: v.North,
      [v.East]: v.West,
      [v.West]: v.East,
    }),
    g(Re, 'PositivePerpendiculars', {
      [v.Down]: [v.East, v.North],
      [v.Up]: [v.East, v.North],
      [v.North]: [v.East, v.Up],
      [v.South]: [v.East, v.Up],
      [v.East]: [v.North, v.Up],
      [v.West]: [v.North, v.Up],
    }),
    g(Re, 'NegativePerpendiculars', {
      [v.Down]: [v.West, v.South],
      [v.Up]: [v.West, v.South],
      [v.North]: [v.West, v.Down],
      [v.South]: [v.West, v.Down],
      [v.East]: [v.South, v.Down],
      [v.West]: [v.South, v.Down],
    }),
    g(Re, 'ClockwisePerpendiculars', {
      [v.North]: v.East,
      [v.East]: v.South,
      [v.South]: v.West,
      [v.West]: v.North,
      [v.Up]: v.Down,
      [v.Down]: v.Up,
    }),
    g(Re, 'CounterClockwisePerpendiculars', {
      [v.North]: v.West,
      [v.East]: v.North,
      [v.South]: v.East,
      [v.West]: v.South,
      [v.Up]: v.Down,
      [v.Down]: v.Up,
    }),
    g(Re, 'SameAxis', {
      [v.North]: v.North,
      [v.South]: v.North,
      [v.East]: v.East,
      [v.West]: v.East,
      [v.Up]: v.Up,
      [v.Down]: v.Up,
    }),
    g(Re, 'FromString', {
      north: v.North,
      east: v.East,
      south: v.South,
      west: v.West,
      up: v.Up,
      down: v.Down,
    }),
    g(Re, 'Values', [v.Down, v.Up, v.North, v.South, v.East, v.West]),
    Re);
var Qd = h.getLogger('itemUtils', 'bedrock-boost', 'itemUtils');
import { system as du, world as cu } from '@minecraft/server';
import { world as pu } from '@minecraft/server';
var fu = !1,
  Jo = '[stylish:events]';
function qe(e, r) {
  if (fu)
    try {
      r ? console.debug(Jo, e, r) : console.debug(Jo, e);
    } catch {}
}
var Yt = Object.create(null);
function ar(e) {
  return Yt[e] ?? (Yt[e] = []);
}
var Wn = new WeakMap(),
  Xo = {},
  On = !1;
function mu(e) {
  return (r) => {
    let t = ar(e);
    qe('dispatch', { event: e, count: t.length });
    for (let n of t) n(r);
  };
}
function Yo(e) {
  if ((qe('wirePlatformEvent', { event: e }), Xo[e])) {
    qe('alreadyWired', { event: e });
    return;
  }
  switch (e) {
    case 'startup':
    case 'worldLoad':
      break;
    case 'beforeItemUse':
      (qe('subscribe', { source: 'world.beforeEvents.itemUse' }),
        pu.beforeEvents.itemUse.subscribe(mu('beforeItemUse')),
        (Xo[e] = !0));
      break;
    default:
      break;
  }
}
function Kt(e) {
  if ((qe('maybeWirePlatformEvents', { startupTriggered: On }), !!On)) {
    if (e) {
      ar(e).length > 0 && Yo(e);
      return;
    }
    for (let r of Object.keys(Yt)) ar(r).length > 0 && Yo(r);
  }
}
function Ln(e) {
  return function (n, o, i) {
    if (typeof n == 'function' && o === void 0 && i === void 0) {
      (qe('register:function', { event: e }), ar(e).push(n), Kt(e));
      return;
    }
    if (o !== void 0 && i && typeof i.value == 'function') {
      if (typeof n == 'function') {
        qe('register:static', { event: e, propertyKey: String(o) });
        let s = i.value.bind(n);
        return (ar(e).push(s), Kt(e), i);
      }
      qe('annotate:instance', { event: e, propertyKey: String(o) });
      let a = n.constructor,
        u = Wn.get(a);
      u || ((u = new Map()), Wn.set(a, u));
      let _ = u.get(e) ?? [];
      return (_.includes(o) || _.push(o), u.set(e, _), i);
    }
  };
}
var Kd = Ln('startup'),
  ue = Ln('worldLoad'),
  Zd = Ln('beforeItemUse');
function qn(e) {
  if (!e) return;
  let r = e.constructor,
    t = Wn.get(r);
  if (t)
    for (let [n, o] of t) {
      let i = ar(n);
      for (let a of o) {
        let u = e[a];
        typeof u == 'function' && i.push(u.bind(e));
      }
      (qe('register:instance', { event: n, class: r?.name ?? '<anonymous>', count: o.length }),
        Kt(n));
    }
}
function gu(e) {
  ((On = !0), Kt());
  let r = ar('startup');
  qe('triggerStartupEvent', { count: r.length });
  for (let t of r) t(e);
}
function hu(e) {
  let r = ar('worldLoad');
  qe('triggerWorldLoadEvent', { count: r.length });
  for (let t of r) t(e);
}
var Ko = [];
function Zt(e) {
  if (!e.componentId) throw new Error(`Component ${e.name} is missing static componentId`);
  Ko.push(e);
}
function bu(e) {
  for (let r of Ko) {
    let t = new r();
    (qn(t), e.registerCustomComponent(r.componentId, t));
  }
}
var Zo = [];
function x(e) {
  if (!e.componentId) throw new Error(`Component ${e.name} is missing static componentId`);
  Zo.push(e);
}
function xu(e) {
  for (let r of Zo) {
    let t = new r();
    (qn(t), e.registerCustomComponent(r.componentId, t));
  }
}
var Io = [];
function To(e) {
  Io.push(e);
}
function wu(e) {
  for (let r of Io) {
    let t = new r();
    qn(t);
    let n,
      o = r.run;
    if (
      (typeof o == 'function' ? (n = o.bind(r)) : typeof t.run == 'function' && (n = t.run.bind(t)),
      !n)
    )
      throw new Error(
        `Custom command ${r.name} has no run method. Define a static or instance run(origin, ...args).`,
      );
    e.registerCommand(t, n);
  }
}
function m(e, r, t) {
  let n = t.value;
  return {
    configurable: !0,
    enumerable: t.enumerable,
    get() {
      let o = n.bind(this);
      return (
        Object.defineProperty(this, r, {
          value: o,
          configurable: !0,
          writable: !0,
          enumerable: !1,
        }),
        o
      );
    },
  };
}
function Mo() {
  (du.beforeEvents.startup.subscribe((e) => {
    (ku(e.itemComponentRegistry, e.blockComponentRegistry), wu(e.customCommandRegistry), gu(e));
  }),
    cu.afterEvents.worldLoad.subscribe((e) => {
      hu(e);
    }));
}
function ku(e, r) {
  (bu(e), xu(r));
}
import {
  Direction as Be,
  EquipmentSlot as Ou,
  GameMode as di,
  ItemComponentTypes as Lu,
  system as en,
} from '@minecraft/server';
var vu = ((e) => (
    (e.BambooJungle = 'minecraft:bamboo_jungle'),
    (e.BambooJungleHills = 'minecraft:bamboo_jungle_hills'),
    (e.BasaltDeltas = 'minecraft:basalt_deltas'),
    (e.Beach = 'minecraft:beach'),
    (e.BirchForest = 'minecraft:birch_forest'),
    (e.BirchForestHills = 'minecraft:birch_forest_hills'),
    (e.BirchForestHillsMutated = 'minecraft:birch_forest_hills_mutated'),
    (e.BirchForestMutated = 'minecraft:birch_forest_mutated'),
    (e.CherryGrove = 'minecraft:cherry_grove'),
    (e.ColdBeach = 'minecraft:cold_beach'),
    (e.ColdOcean = 'minecraft:cold_ocean'),
    (e.ColdTaiga = 'minecraft:cold_taiga'),
    (e.ColdTaigaHills = 'minecraft:cold_taiga_hills'),
    (e.ColdTaigaMutated = 'minecraft:cold_taiga_mutated'),
    (e.CrimsonForest = 'minecraft:crimson_forest'),
    (e.DeepColdOcean = 'minecraft:deep_cold_ocean'),
    (e.DeepDark = 'minecraft:deep_dark'),
    (e.DeepFrozenOcean = 'minecraft:deep_frozen_ocean'),
    (e.DeepLukewarmOcean = 'minecraft:deep_lukewarm_ocean'),
    (e.DeepOcean = 'minecraft:deep_ocean'),
    (e.DeepWarmOcean = 'minecraft:deep_warm_ocean'),
    (e.Desert = 'minecraft:desert'),
    (e.DesertHills = 'minecraft:desert_hills'),
    (e.DesertMutated = 'minecraft:desert_mutated'),
    (e.DripstoneCaves = 'minecraft:dripstone_caves'),
    (e.ExtremeHills = 'minecraft:extreme_hills'),
    (e.ExtremeHillsEdge = 'minecraft:extreme_hills_edge'),
    (e.ExtremeHillsMutated = 'minecraft:extreme_hills_mutated'),
    (e.ExtremeHillsPlusTrees = 'minecraft:extreme_hills_plus_trees'),
    (e.ExtremeHillsPlusTreesMutated = 'minecraft:extreme_hills_plus_trees_mutated'),
    (e.FlowerForest = 'minecraft:flower_forest'),
    (e.Forest = 'minecraft:forest'),
    (e.ForestHills = 'minecraft:forest_hills'),
    (e.FrozenOcean = 'minecraft:frozen_ocean'),
    (e.FrozenPeaks = 'minecraft:frozen_peaks'),
    (e.FrozenRiver = 'minecraft:frozen_river'),
    (e.Grove = 'minecraft:grove'),
    (e.Hell = 'minecraft:hell'),
    (e.IceMountains = 'minecraft:ice_mountains'),
    (e.IcePlains = 'minecraft:ice_plains'),
    (e.IcePlainsSpikes = 'minecraft:ice_plains_spikes'),
    (e.JaggedPeaks = 'minecraft:jagged_peaks'),
    (e.Jungle = 'minecraft:jungle'),
    (e.JungleEdge = 'minecraft:jungle_edge'),
    (e.JungleEdgeMutated = 'minecraft:jungle_edge_mutated'),
    (e.JungleHills = 'minecraft:jungle_hills'),
    (e.JungleMutated = 'minecraft:jungle_mutated'),
    (e.LegacyFrozenOcean = 'minecraft:legacy_frozen_ocean'),
    (e.LukewarmOcean = 'minecraft:lukewarm_ocean'),
    (e.LushCaves = 'minecraft:lush_caves'),
    (e.MangroveSwamp = 'minecraft:mangrove_swamp'),
    (e.Meadow = 'minecraft:meadow'),
    (e.MegaTaiga = 'minecraft:mega_taiga'),
    (e.MegaTaigaHills = 'minecraft:mega_taiga_hills'),
    (e.Mesa = 'minecraft:mesa'),
    (e.MesaBryce = 'minecraft:mesa_bryce'),
    (e.MesaPlateau = 'minecraft:mesa_plateau'),
    (e.MesaPlateauMutated = 'minecraft:mesa_plateau_mutated'),
    (e.MesaPlateauStone = 'minecraft:mesa_plateau_stone'),
    (e.MesaPlateauStoneMutated = 'minecraft:mesa_plateau_stone_mutated'),
    (e.MushroomIsland = 'minecraft:mushroom_island'),
    (e.MushroomIslandShore = 'minecraft:mushroom_island_shore'),
    (e.Ocean = 'minecraft:ocean'),
    (e.PaleGarden = 'minecraft:pale_garden'),
    (e.Plains = 'minecraft:plains'),
    (e.RedwoodTaigaHillsMutated = 'minecraft:redwood_taiga_hills_mutated'),
    (e.RedwoodTaigaMutated = 'minecraft:redwood_taiga_mutated'),
    (e.River = 'minecraft:river'),
    (e.RoofedForest = 'minecraft:roofed_forest'),
    (e.RoofedForestMutated = 'minecraft:roofed_forest_mutated'),
    (e.Savanna = 'minecraft:savanna'),
    (e.SavannaMutated = 'minecraft:savanna_mutated'),
    (e.SavannaPlateau = 'minecraft:savanna_plateau'),
    (e.SavannaPlateauMutated = 'minecraft:savanna_plateau_mutated'),
    (e.SnowySlopes = 'minecraft:snowy_slopes'),
    (e.SoulsandValley = 'minecraft:soulsand_valley'),
    (e.StoneBeach = 'minecraft:stone_beach'),
    (e.StonyPeaks = 'minecraft:stony_peaks'),
    (e.SunflowerPlains = 'minecraft:sunflower_plains'),
    (e.Swampland = 'minecraft:swampland'),
    (e.SwamplandMutated = 'minecraft:swampland_mutated'),
    (e.Taiga = 'minecraft:taiga'),
    (e.TaigaHills = 'minecraft:taiga_hills'),
    (e.TaigaMutated = 'minecraft:taiga_mutated'),
    (e.TheEnd = 'minecraft:the_end'),
    (e.WarmOcean = 'minecraft:warm_ocean'),
    (e.WarpedForest = 'minecraft:warped_forest'),
    e
  ))(vu || {}),
  te = ((e) => (
    (e.AcaciaButton = 'minecraft:acacia_button'),
    (e.AcaciaDoor = 'minecraft:acacia_door'),
    (e.AcaciaDoubleSlab = 'minecraft:acacia_double_slab'),
    (e.AcaciaFence = 'minecraft:acacia_fence'),
    (e.AcaciaFenceGate = 'minecraft:acacia_fence_gate'),
    (e.AcaciaHangingSign = 'minecraft:acacia_hanging_sign'),
    (e.AcaciaLeaves = 'minecraft:acacia_leaves'),
    (e.AcaciaLog = 'minecraft:acacia_log'),
    (e.AcaciaPlanks = 'minecraft:acacia_planks'),
    (e.AcaciaPressurePlate = 'minecraft:acacia_pressure_plate'),
    (e.AcaciaSapling = 'minecraft:acacia_sapling'),
    (e.AcaciaShelf = 'minecraft:acacia_shelf'),
    (e.AcaciaSlab = 'minecraft:acacia_slab'),
    (e.AcaciaStairs = 'minecraft:acacia_stairs'),
    (e.AcaciaStandingSign = 'minecraft:acacia_standing_sign'),
    (e.AcaciaTrapdoor = 'minecraft:acacia_trapdoor'),
    (e.AcaciaWallSign = 'minecraft:acacia_wall_sign'),
    (e.AcaciaWood = 'minecraft:acacia_wood'),
    (e.ActivatorRail = 'minecraft:activator_rail'),
    (e.Air = 'minecraft:air'),
    (e.Allium = 'minecraft:allium'),
    (e.Allow = 'minecraft:allow'),
    (e.AmethystBlock = 'minecraft:amethyst_block'),
    (e.AmethystCluster = 'minecraft:amethyst_cluster'),
    (e.AncientDebris = 'minecraft:ancient_debris'),
    (e.Andesite = 'minecraft:andesite'),
    (e.AndesiteDoubleSlab = 'minecraft:andesite_double_slab'),
    (e.AndesiteSlab = 'minecraft:andesite_slab'),
    (e.AndesiteStairs = 'minecraft:andesite_stairs'),
    (e.AndesiteWall = 'minecraft:andesite_wall'),
    (e.Anvil = 'minecraft:anvil'),
    (e.Azalea = 'minecraft:azalea'),
    (e.AzaleaLeaves = 'minecraft:azalea_leaves'),
    (e.AzaleaLeavesFlowered = 'minecraft:azalea_leaves_flowered'),
    (e.AzureBluet = 'minecraft:azure_bluet'),
    (e.Bamboo = 'minecraft:bamboo'),
    (e.BambooBlock = 'minecraft:bamboo_block'),
    (e.BambooButton = 'minecraft:bamboo_button'),
    (e.BambooDoor = 'minecraft:bamboo_door'),
    (e.BambooDoubleSlab = 'minecraft:bamboo_double_slab'),
    (e.BambooFence = 'minecraft:bamboo_fence'),
    (e.BambooFenceGate = 'minecraft:bamboo_fence_gate'),
    (e.BambooHangingSign = 'minecraft:bamboo_hanging_sign'),
    (e.BambooMosaic = 'minecraft:bamboo_mosaic'),
    (e.BambooMosaicDoubleSlab = 'minecraft:bamboo_mosaic_double_slab'),
    (e.BambooMosaicSlab = 'minecraft:bamboo_mosaic_slab'),
    (e.BambooMosaicStairs = 'minecraft:bamboo_mosaic_stairs'),
    (e.BambooPlanks = 'minecraft:bamboo_planks'),
    (e.BambooPressurePlate = 'minecraft:bamboo_pressure_plate'),
    (e.BambooSapling = 'minecraft:bamboo_sapling'),
    (e.BambooShelf = 'minecraft:bamboo_shelf'),
    (e.BambooSlab = 'minecraft:bamboo_slab'),
    (e.BambooStairs = 'minecraft:bamboo_stairs'),
    (e.BambooStandingSign = 'minecraft:bamboo_standing_sign'),
    (e.BambooTrapdoor = 'minecraft:bamboo_trapdoor'),
    (e.BambooWallSign = 'minecraft:bamboo_wall_sign'),
    (e.Barrel = 'minecraft:barrel'),
    (e.Barrier = 'minecraft:barrier'),
    (e.Basalt = 'minecraft:basalt'),
    (e.Beacon = 'minecraft:beacon'),
    (e.Bed = 'minecraft:bed'),
    (e.Bedrock = 'minecraft:bedrock'),
    (e.BeeNest = 'minecraft:bee_nest'),
    (e.Beehive = 'minecraft:beehive'),
    (e.Beetroot = 'minecraft:beetroot'),
    (e.Bell = 'minecraft:bell'),
    (e.BigDripleaf = 'minecraft:big_dripleaf'),
    (e.BirchButton = 'minecraft:birch_button'),
    (e.BirchDoor = 'minecraft:birch_door'),
    (e.BirchDoubleSlab = 'minecraft:birch_double_slab'),
    (e.BirchFence = 'minecraft:birch_fence'),
    (e.BirchFenceGate = 'minecraft:birch_fence_gate'),
    (e.BirchHangingSign = 'minecraft:birch_hanging_sign'),
    (e.BirchLeaves = 'minecraft:birch_leaves'),
    (e.BirchLog = 'minecraft:birch_log'),
    (e.BirchPlanks = 'minecraft:birch_planks'),
    (e.BirchPressurePlate = 'minecraft:birch_pressure_plate'),
    (e.BirchSapling = 'minecraft:birch_sapling'),
    (e.BirchShelf = 'minecraft:birch_shelf'),
    (e.BirchSlab = 'minecraft:birch_slab'),
    (e.BirchStairs = 'minecraft:birch_stairs'),
    (e.BirchStandingSign = 'minecraft:birch_standing_sign'),
    (e.BirchTrapdoor = 'minecraft:birch_trapdoor'),
    (e.BirchWallSign = 'minecraft:birch_wall_sign'),
    (e.BirchWood = 'minecraft:birch_wood'),
    (e.BlackCandle = 'minecraft:black_candle'),
    (e.BlackCandleCake = 'minecraft:black_candle_cake'),
    (e.BlackCarpet = 'minecraft:black_carpet'),
    (e.BlackConcrete = 'minecraft:black_concrete'),
    (e.BlackConcretePowder = 'minecraft:black_concrete_powder'),
    (e.BlackGlazedTerracotta = 'minecraft:black_glazed_terracotta'),
    (e.BlackShulkerBox = 'minecraft:black_shulker_box'),
    (e.BlackStainedGlass = 'minecraft:black_stained_glass'),
    (e.BlackStainedGlassPane = 'minecraft:black_stained_glass_pane'),
    (e.BlackTerracotta = 'minecraft:black_terracotta'),
    (e.BlackWool = 'minecraft:black_wool'),
    (e.Blackstone = 'minecraft:blackstone'),
    (e.BlackstoneDoubleSlab = 'minecraft:blackstone_double_slab'),
    (e.BlackstoneSlab = 'minecraft:blackstone_slab'),
    (e.BlackstoneStairs = 'minecraft:blackstone_stairs'),
    (e.BlackstoneWall = 'minecraft:blackstone_wall'),
    (e.BlastFurnace = 'minecraft:blast_furnace'),
    (e.BlueCandle = 'minecraft:blue_candle'),
    (e.BlueCandleCake = 'minecraft:blue_candle_cake'),
    (e.BlueCarpet = 'minecraft:blue_carpet'),
    (e.BlueConcrete = 'minecraft:blue_concrete'),
    (e.BlueConcretePowder = 'minecraft:blue_concrete_powder'),
    (e.BlueGlazedTerracotta = 'minecraft:blue_glazed_terracotta'),
    (e.BlueIce = 'minecraft:blue_ice'),
    (e.BlueOrchid = 'minecraft:blue_orchid'),
    (e.BlueShulkerBox = 'minecraft:blue_shulker_box'),
    (e.BlueStainedGlass = 'minecraft:blue_stained_glass'),
    (e.BlueStainedGlassPane = 'minecraft:blue_stained_glass_pane'),
    (e.BlueTerracotta = 'minecraft:blue_terracotta'),
    (e.BlueWool = 'minecraft:blue_wool'),
    (e.BoneBlock = 'minecraft:bone_block'),
    (e.Bookshelf = 'minecraft:bookshelf'),
    (e.BorderBlock = 'minecraft:border_block'),
    (e.BrainCoral = 'minecraft:brain_coral'),
    (e.BrainCoralBlock = 'minecraft:brain_coral_block'),
    (e.BrainCoralFan = 'minecraft:brain_coral_fan'),
    (e.BrainCoralWallFan = 'minecraft:brain_coral_wall_fan'),
    (e.BrewingStand = 'minecraft:brewing_stand'),
    (e.BrickBlock = 'minecraft:brick_block'),
    (e.BrickDoubleSlab = 'minecraft:brick_double_slab'),
    (e.BrickSlab = 'minecraft:brick_slab'),
    (e.BrickStairs = 'minecraft:brick_stairs'),
    (e.BrickWall = 'minecraft:brick_wall'),
    (e.BrownCandle = 'minecraft:brown_candle'),
    (e.BrownCandleCake = 'minecraft:brown_candle_cake'),
    (e.BrownCarpet = 'minecraft:brown_carpet'),
    (e.BrownConcrete = 'minecraft:brown_concrete'),
    (e.BrownConcretePowder = 'minecraft:brown_concrete_powder'),
    (e.BrownGlazedTerracotta = 'minecraft:brown_glazed_terracotta'),
    (e.BrownMushroom = 'minecraft:brown_mushroom'),
    (e.BrownMushroomBlock = 'minecraft:brown_mushroom_block'),
    (e.BrownShulkerBox = 'minecraft:brown_shulker_box'),
    (e.BrownStainedGlass = 'minecraft:brown_stained_glass'),
    (e.BrownStainedGlassPane = 'minecraft:brown_stained_glass_pane'),
    (e.BrownTerracotta = 'minecraft:brown_terracotta'),
    (e.BrownWool = 'minecraft:brown_wool'),
    (e.BubbleColumn = 'minecraft:bubble_column'),
    (e.BubbleCoral = 'minecraft:bubble_coral'),
    (e.BubbleCoralBlock = 'minecraft:bubble_coral_block'),
    (e.BubbleCoralFan = 'minecraft:bubble_coral_fan'),
    (e.BubbleCoralWallFan = 'minecraft:bubble_coral_wall_fan'),
    (e.BuddingAmethyst = 'minecraft:budding_amethyst'),
    (e.Bush = 'minecraft:bush'),
    (e.Cactus = 'minecraft:cactus'),
    (e.CactusFlower = 'minecraft:cactus_flower'),
    (e.Cake = 'minecraft:cake'),
    (e.Calcite = 'minecraft:calcite'),
    (e.CalibratedSculkSensor = 'minecraft:calibrated_sculk_sensor'),
    (e.Camera = 'minecraft:camera'),
    (e.Campfire = 'minecraft:campfire'),
    (e.Candle = 'minecraft:candle'),
    (e.CandleCake = 'minecraft:candle_cake'),
    (e.Carrots = 'minecraft:carrots'),
    (e.CartographyTable = 'minecraft:cartography_table'),
    (e.CarvedPumpkin = 'minecraft:carved_pumpkin'),
    (e.Cauldron = 'minecraft:cauldron'),
    (e.CaveVines = 'minecraft:cave_vines'),
    (e.CaveVinesBodyWithBerries = 'minecraft:cave_vines_body_with_berries'),
    (e.CaveVinesHeadWithBerries = 'minecraft:cave_vines_head_with_berries'),
    (e.ChainCommandBlock = 'minecraft:chain_command_block'),
    (e.ChemicalHeat = 'minecraft:chemical_heat'),
    (e.CherryButton = 'minecraft:cherry_button'),
    (e.CherryDoor = 'minecraft:cherry_door'),
    (e.CherryDoubleSlab = 'minecraft:cherry_double_slab'),
    (e.CherryFence = 'minecraft:cherry_fence'),
    (e.CherryFenceGate = 'minecraft:cherry_fence_gate'),
    (e.CherryHangingSign = 'minecraft:cherry_hanging_sign'),
    (e.CherryLeaves = 'minecraft:cherry_leaves'),
    (e.CherryLog = 'minecraft:cherry_log'),
    (e.CherryPlanks = 'minecraft:cherry_planks'),
    (e.CherryPressurePlate = 'minecraft:cherry_pressure_plate'),
    (e.CherrySapling = 'minecraft:cherry_sapling'),
    (e.CherryShelf = 'minecraft:cherry_shelf'),
    (e.CherrySlab = 'minecraft:cherry_slab'),
    (e.CherryStairs = 'minecraft:cherry_stairs'),
    (e.CherryStandingSign = 'minecraft:cherry_standing_sign'),
    (e.CherryTrapdoor = 'minecraft:cherry_trapdoor'),
    (e.CherryWallSign = 'minecraft:cherry_wall_sign'),
    (e.CherryWood = 'minecraft:cherry_wood'),
    (e.Chest = 'minecraft:chest'),
    (e.ChippedAnvil = 'minecraft:chipped_anvil'),
    (e.ChiseledBookshelf = 'minecraft:chiseled_bookshelf'),
    (e.ChiseledCopper = 'minecraft:chiseled_copper'),
    (e.ChiseledDeepslate = 'minecraft:chiseled_deepslate'),
    (e.ChiseledNetherBricks = 'minecraft:chiseled_nether_bricks'),
    (e.ChiseledPolishedBlackstone = 'minecraft:chiseled_polished_blackstone'),
    (e.ChiseledQuartzBlock = 'minecraft:chiseled_quartz_block'),
    (e.ChiseledRedSandstone = 'minecraft:chiseled_red_sandstone'),
    (e.ChiseledResinBricks = 'minecraft:chiseled_resin_bricks'),
    (e.ChiseledSandstone = 'minecraft:chiseled_sandstone'),
    (e.ChiseledStoneBricks = 'minecraft:chiseled_stone_bricks'),
    (e.ChiseledTuff = 'minecraft:chiseled_tuff'),
    (e.ChiseledTuffBricks = 'minecraft:chiseled_tuff_bricks'),
    (e.ChorusFlower = 'minecraft:chorus_flower'),
    (e.ChorusPlant = 'minecraft:chorus_plant'),
    (e.Clay = 'minecraft:clay'),
    (e.ClosedEyeblossom = 'minecraft:closed_eyeblossom'),
    (e.CoalBlock = 'minecraft:coal_block'),
    (e.CoalOre = 'minecraft:coal_ore'),
    (e.CoarseDirt = 'minecraft:coarse_dirt'),
    (e.CobbledDeepslate = 'minecraft:cobbled_deepslate'),
    (e.CobbledDeepslateDoubleSlab = 'minecraft:cobbled_deepslate_double_slab'),
    (e.CobbledDeepslateSlab = 'minecraft:cobbled_deepslate_slab'),
    (e.CobbledDeepslateStairs = 'minecraft:cobbled_deepslate_stairs'),
    (e.CobbledDeepslateWall = 'minecraft:cobbled_deepslate_wall'),
    (e.Cobblestone = 'minecraft:cobblestone'),
    (e.CobblestoneDoubleSlab = 'minecraft:cobblestone_double_slab'),
    (e.CobblestoneSlab = 'minecraft:cobblestone_slab'),
    (e.CobblestoneWall = 'minecraft:cobblestone_wall'),
    (e.Cocoa = 'minecraft:cocoa'),
    (e.ColoredTorchBlue = 'minecraft:colored_torch_blue'),
    (e.ColoredTorchGreen = 'minecraft:colored_torch_green'),
    (e.ColoredTorchPurple = 'minecraft:colored_torch_purple'),
    (e.ColoredTorchRed = 'minecraft:colored_torch_red'),
    (e.CommandBlock = 'minecraft:command_block'),
    (e.Composter = 'minecraft:composter'),
    (e.CompoundCreator = 'minecraft:compound_creator'),
    (e.Conduit = 'minecraft:conduit'),
    (e.CopperBars = 'minecraft:copper_bars'),
    (e.CopperBlock = 'minecraft:copper_block'),
    (e.CopperBulb = 'minecraft:copper_bulb'),
    (e.CopperChain = 'minecraft:copper_chain'),
    (e.CopperChest = 'minecraft:copper_chest'),
    (e.CopperDoor = 'minecraft:copper_door'),
    (e.CopperGolemStatue = 'minecraft:copper_golem_statue'),
    (e.CopperGrate = 'minecraft:copper_grate'),
    (e.CopperLantern = 'minecraft:copper_lantern'),
    (e.CopperOre = 'minecraft:copper_ore'),
    (e.CopperTorch = 'minecraft:copper_torch'),
    (e.CopperTrapdoor = 'minecraft:copper_trapdoor'),
    (e.Cornflower = 'minecraft:cornflower'),
    (e.CrackedDeepslateBricks = 'minecraft:cracked_deepslate_bricks'),
    (e.CrackedDeepslateTiles = 'minecraft:cracked_deepslate_tiles'),
    (e.CrackedNetherBricks = 'minecraft:cracked_nether_bricks'),
    (e.CrackedPolishedBlackstoneBricks = 'minecraft:cracked_polished_blackstone_bricks'),
    (e.CrackedStoneBricks = 'minecraft:cracked_stone_bricks'),
    (e.Crafter = 'minecraft:crafter'),
    (e.CraftingTable = 'minecraft:crafting_table'),
    (e.CreakingHeart = 'minecraft:creaking_heart'),
    (e.CreeperHead = 'minecraft:creeper_head'),
    (e.CrimsonButton = 'minecraft:crimson_button'),
    (e.CrimsonDoor = 'minecraft:crimson_door'),
    (e.CrimsonDoubleSlab = 'minecraft:crimson_double_slab'),
    (e.CrimsonFence = 'minecraft:crimson_fence'),
    (e.CrimsonFenceGate = 'minecraft:crimson_fence_gate'),
    (e.CrimsonFungus = 'minecraft:crimson_fungus'),
    (e.CrimsonHangingSign = 'minecraft:crimson_hanging_sign'),
    (e.CrimsonHyphae = 'minecraft:crimson_hyphae'),
    (e.CrimsonNylium = 'minecraft:crimson_nylium'),
    (e.CrimsonPlanks = 'minecraft:crimson_planks'),
    (e.CrimsonPressurePlate = 'minecraft:crimson_pressure_plate'),
    (e.CrimsonRoots = 'minecraft:crimson_roots'),
    (e.CrimsonShelf = 'minecraft:crimson_shelf'),
    (e.CrimsonSlab = 'minecraft:crimson_slab'),
    (e.CrimsonStairs = 'minecraft:crimson_stairs'),
    (e.CrimsonStandingSign = 'minecraft:crimson_standing_sign'),
    (e.CrimsonStem = 'minecraft:crimson_stem'),
    (e.CrimsonTrapdoor = 'minecraft:crimson_trapdoor'),
    (e.CrimsonWallSign = 'minecraft:crimson_wall_sign'),
    (e.CryingObsidian = 'minecraft:crying_obsidian'),
    (e.CutCopper = 'minecraft:cut_copper'),
    (e.CutCopperSlab = 'minecraft:cut_copper_slab'),
    (e.CutCopperStairs = 'minecraft:cut_copper_stairs'),
    (e.CutRedSandstone = 'minecraft:cut_red_sandstone'),
    (e.CutRedSandstoneDoubleSlab = 'minecraft:cut_red_sandstone_double_slab'),
    (e.CutRedSandstoneSlab = 'minecraft:cut_red_sandstone_slab'),
    (e.CutSandstone = 'minecraft:cut_sandstone'),
    (e.CutSandstoneDoubleSlab = 'minecraft:cut_sandstone_double_slab'),
    (e.CutSandstoneSlab = 'minecraft:cut_sandstone_slab'),
    (e.CyanCandle = 'minecraft:cyan_candle'),
    (e.CyanCandleCake = 'minecraft:cyan_candle_cake'),
    (e.CyanCarpet = 'minecraft:cyan_carpet'),
    (e.CyanConcrete = 'minecraft:cyan_concrete'),
    (e.CyanConcretePowder = 'minecraft:cyan_concrete_powder'),
    (e.CyanGlazedTerracotta = 'minecraft:cyan_glazed_terracotta'),
    (e.CyanShulkerBox = 'minecraft:cyan_shulker_box'),
    (e.CyanStainedGlass = 'minecraft:cyan_stained_glass'),
    (e.CyanStainedGlassPane = 'minecraft:cyan_stained_glass_pane'),
    (e.CyanTerracotta = 'minecraft:cyan_terracotta'),
    (e.CyanWool = 'minecraft:cyan_wool'),
    (e.DamagedAnvil = 'minecraft:damaged_anvil'),
    (e.Dandelion = 'minecraft:dandelion'),
    (e.DarkOakButton = 'minecraft:dark_oak_button'),
    (e.DarkOakDoor = 'minecraft:dark_oak_door'),
    (e.DarkOakDoubleSlab = 'minecraft:dark_oak_double_slab'),
    (e.DarkOakFence = 'minecraft:dark_oak_fence'),
    (e.DarkOakFenceGate = 'minecraft:dark_oak_fence_gate'),
    (e.DarkOakHangingSign = 'minecraft:dark_oak_hanging_sign'),
    (e.DarkOakLeaves = 'minecraft:dark_oak_leaves'),
    (e.DarkOakLog = 'minecraft:dark_oak_log'),
    (e.DarkOakPlanks = 'minecraft:dark_oak_planks'),
    (e.DarkOakPressurePlate = 'minecraft:dark_oak_pressure_plate'),
    (e.DarkOakSapling = 'minecraft:dark_oak_sapling'),
    (e.DarkOakShelf = 'minecraft:dark_oak_shelf'),
    (e.DarkOakSlab = 'minecraft:dark_oak_slab'),
    (e.DarkOakStairs = 'minecraft:dark_oak_stairs'),
    (e.DarkOakTrapdoor = 'minecraft:dark_oak_trapdoor'),
    (e.DarkOakWood = 'minecraft:dark_oak_wood'),
    (e.DarkPrismarine = 'minecraft:dark_prismarine'),
    (e.DarkPrismarineDoubleSlab = 'minecraft:dark_prismarine_double_slab'),
    (e.DarkPrismarineSlab = 'minecraft:dark_prismarine_slab'),
    (e.DarkPrismarineStairs = 'minecraft:dark_prismarine_stairs'),
    (e.DarkoakStandingSign = 'minecraft:darkoak_standing_sign'),
    (e.DarkoakWallSign = 'minecraft:darkoak_wall_sign'),
    (e.DaylightDetector = 'minecraft:daylight_detector'),
    (e.DaylightDetectorInverted = 'minecraft:daylight_detector_inverted'),
    (e.DeadBrainCoral = 'minecraft:dead_brain_coral'),
    (e.DeadBrainCoralBlock = 'minecraft:dead_brain_coral_block'),
    (e.DeadBrainCoralFan = 'minecraft:dead_brain_coral_fan'),
    (e.DeadBrainCoralWallFan = 'minecraft:dead_brain_coral_wall_fan'),
    (e.DeadBubbleCoral = 'minecraft:dead_bubble_coral'),
    (e.DeadBubbleCoralBlock = 'minecraft:dead_bubble_coral_block'),
    (e.DeadBubbleCoralFan = 'minecraft:dead_bubble_coral_fan'),
    (e.DeadBubbleCoralWallFan = 'minecraft:dead_bubble_coral_wall_fan'),
    (e.DeadFireCoral = 'minecraft:dead_fire_coral'),
    (e.DeadFireCoralBlock = 'minecraft:dead_fire_coral_block'),
    (e.DeadFireCoralFan = 'minecraft:dead_fire_coral_fan'),
    (e.DeadFireCoralWallFan = 'minecraft:dead_fire_coral_wall_fan'),
    (e.DeadHornCoral = 'minecraft:dead_horn_coral'),
    (e.DeadHornCoralBlock = 'minecraft:dead_horn_coral_block'),
    (e.DeadHornCoralFan = 'minecraft:dead_horn_coral_fan'),
    (e.DeadHornCoralWallFan = 'minecraft:dead_horn_coral_wall_fan'),
    (e.DeadTubeCoral = 'minecraft:dead_tube_coral'),
    (e.DeadTubeCoralBlock = 'minecraft:dead_tube_coral_block'),
    (e.DeadTubeCoralFan = 'minecraft:dead_tube_coral_fan'),
    (e.DeadTubeCoralWallFan = 'minecraft:dead_tube_coral_wall_fan'),
    (e.Deadbush = 'minecraft:deadbush'),
    (e.DecoratedPot = 'minecraft:decorated_pot'),
    (e.Deepslate = 'minecraft:deepslate'),
    (e.DeepslateBrickDoubleSlab = 'minecraft:deepslate_brick_double_slab'),
    (e.DeepslateBrickSlab = 'minecraft:deepslate_brick_slab'),
    (e.DeepslateBrickStairs = 'minecraft:deepslate_brick_stairs'),
    (e.DeepslateBrickWall = 'minecraft:deepslate_brick_wall'),
    (e.DeepslateBricks = 'minecraft:deepslate_bricks'),
    (e.DeepslateCoalOre = 'minecraft:deepslate_coal_ore'),
    (e.DeepslateCopperOre = 'minecraft:deepslate_copper_ore'),
    (e.DeepslateDiamondOre = 'minecraft:deepslate_diamond_ore'),
    (e.DeepslateEmeraldOre = 'minecraft:deepslate_emerald_ore'),
    (e.DeepslateGoldOre = 'minecraft:deepslate_gold_ore'),
    (e.DeepslateIronOre = 'minecraft:deepslate_iron_ore'),
    (e.DeepslateLapisOre = 'minecraft:deepslate_lapis_ore'),
    (e.DeepslateRedstoneOre = 'minecraft:deepslate_redstone_ore'),
    (e.DeepslateTileDoubleSlab = 'minecraft:deepslate_tile_double_slab'),
    (e.DeepslateTileSlab = 'minecraft:deepslate_tile_slab'),
    (e.DeepslateTileStairs = 'minecraft:deepslate_tile_stairs'),
    (e.DeepslateTileWall = 'minecraft:deepslate_tile_wall'),
    (e.DeepslateTiles = 'minecraft:deepslate_tiles'),
    (e.Deny = 'minecraft:deny'),
    (e.DetectorRail = 'minecraft:detector_rail'),
    (e.DiamondBlock = 'minecraft:diamond_block'),
    (e.DiamondOre = 'minecraft:diamond_ore'),
    (e.Diorite = 'minecraft:diorite'),
    (e.DioriteDoubleSlab = 'minecraft:diorite_double_slab'),
    (e.DioriteSlab = 'minecraft:diorite_slab'),
    (e.DioriteStairs = 'minecraft:diorite_stairs'),
    (e.DioriteWall = 'minecraft:diorite_wall'),
    (e.Dirt = 'minecraft:dirt'),
    (e.DirtWithRoots = 'minecraft:dirt_with_roots'),
    (e.Dispenser = 'minecraft:dispenser'),
    (e.DoubleCutCopperSlab = 'minecraft:double_cut_copper_slab'),
    (e.DragonEgg = 'minecraft:dragon_egg'),
    (e.DragonHead = 'minecraft:dragon_head'),
    (e.DriedGhast = 'minecraft:dried_ghast'),
    (e.DriedKelpBlock = 'minecraft:dried_kelp_block'),
    (e.DripstoneBlock = 'minecraft:dripstone_block'),
    (e.Dropper = 'minecraft:dropper'),
    (e.Element0 = 'minecraft:element_0'),
    (e.Element1 = 'minecraft:element_1'),
    (e.Element10 = 'minecraft:element_10'),
    (e.Element100 = 'minecraft:element_100'),
    (e.Element101 = 'minecraft:element_101'),
    (e.Element102 = 'minecraft:element_102'),
    (e.Element103 = 'minecraft:element_103'),
    (e.Element104 = 'minecraft:element_104'),
    (e.Element105 = 'minecraft:element_105'),
    (e.Element106 = 'minecraft:element_106'),
    (e.Element107 = 'minecraft:element_107'),
    (e.Element108 = 'minecraft:element_108'),
    (e.Element109 = 'minecraft:element_109'),
    (e.Element11 = 'minecraft:element_11'),
    (e.Element110 = 'minecraft:element_110'),
    (e.Element111 = 'minecraft:element_111'),
    (e.Element112 = 'minecraft:element_112'),
    (e.Element113 = 'minecraft:element_113'),
    (e.Element114 = 'minecraft:element_114'),
    (e.Element115 = 'minecraft:element_115'),
    (e.Element116 = 'minecraft:element_116'),
    (e.Element117 = 'minecraft:element_117'),
    (e.Element118 = 'minecraft:element_118'),
    (e.Element12 = 'minecraft:element_12'),
    (e.Element13 = 'minecraft:element_13'),
    (e.Element14 = 'minecraft:element_14'),
    (e.Element15 = 'minecraft:element_15'),
    (e.Element16 = 'minecraft:element_16'),
    (e.Element17 = 'minecraft:element_17'),
    (e.Element18 = 'minecraft:element_18'),
    (e.Element19 = 'minecraft:element_19'),
    (e.Element2 = 'minecraft:element_2'),
    (e.Element20 = 'minecraft:element_20'),
    (e.Element21 = 'minecraft:element_21'),
    (e.Element22 = 'minecraft:element_22'),
    (e.Element23 = 'minecraft:element_23'),
    (e.Element24 = 'minecraft:element_24'),
    (e.Element25 = 'minecraft:element_25'),
    (e.Element26 = 'minecraft:element_26'),
    (e.Element27 = 'minecraft:element_27'),
    (e.Element28 = 'minecraft:element_28'),
    (e.Element29 = 'minecraft:element_29'),
    (e.Element3 = 'minecraft:element_3'),
    (e.Element30 = 'minecraft:element_30'),
    (e.Element31 = 'minecraft:element_31'),
    (e.Element32 = 'minecraft:element_32'),
    (e.Element33 = 'minecraft:element_33'),
    (e.Element34 = 'minecraft:element_34'),
    (e.Element35 = 'minecraft:element_35'),
    (e.Element36 = 'minecraft:element_36'),
    (e.Element37 = 'minecraft:element_37'),
    (e.Element38 = 'minecraft:element_38'),
    (e.Element39 = 'minecraft:element_39'),
    (e.Element4 = 'minecraft:element_4'),
    (e.Element40 = 'minecraft:element_40'),
    (e.Element41 = 'minecraft:element_41'),
    (e.Element42 = 'minecraft:element_42'),
    (e.Element43 = 'minecraft:element_43'),
    (e.Element44 = 'minecraft:element_44'),
    (e.Element45 = 'minecraft:element_45'),
    (e.Element46 = 'minecraft:element_46'),
    (e.Element47 = 'minecraft:element_47'),
    (e.Element48 = 'minecraft:element_48'),
    (e.Element49 = 'minecraft:element_49'),
    (e.Element5 = 'minecraft:element_5'),
    (e.Element50 = 'minecraft:element_50'),
    (e.Element51 = 'minecraft:element_51'),
    (e.Element52 = 'minecraft:element_52'),
    (e.Element53 = 'minecraft:element_53'),
    (e.Element54 = 'minecraft:element_54'),
    (e.Element55 = 'minecraft:element_55'),
    (e.Element56 = 'minecraft:element_56'),
    (e.Element57 = 'minecraft:element_57'),
    (e.Element58 = 'minecraft:element_58'),
    (e.Element59 = 'minecraft:element_59'),
    (e.Element6 = 'minecraft:element_6'),
    (e.Element60 = 'minecraft:element_60'),
    (e.Element61 = 'minecraft:element_61'),
    (e.Element62 = 'minecraft:element_62'),
    (e.Element63 = 'minecraft:element_63'),
    (e.Element64 = 'minecraft:element_64'),
    (e.Element65 = 'minecraft:element_65'),
    (e.Element66 = 'minecraft:element_66'),
    (e.Element67 = 'minecraft:element_67'),
    (e.Element68 = 'minecraft:element_68'),
    (e.Element69 = 'minecraft:element_69'),
    (e.Element7 = 'minecraft:element_7'),
    (e.Element70 = 'minecraft:element_70'),
    (e.Element71 = 'minecraft:element_71'),
    (e.Element72 = 'minecraft:element_72'),
    (e.Element73 = 'minecraft:element_73'),
    (e.Element74 = 'minecraft:element_74'),
    (e.Element75 = 'minecraft:element_75'),
    (e.Element76 = 'minecraft:element_76'),
    (e.Element77 = 'minecraft:element_77'),
    (e.Element78 = 'minecraft:element_78'),
    (e.Element79 = 'minecraft:element_79'),
    (e.Element8 = 'minecraft:element_8'),
    (e.Element80 = 'minecraft:element_80'),
    (e.Element81 = 'minecraft:element_81'),
    (e.Element82 = 'minecraft:element_82'),
    (e.Element83 = 'minecraft:element_83'),
    (e.Element84 = 'minecraft:element_84'),
    (e.Element85 = 'minecraft:element_85'),
    (e.Element86 = 'minecraft:element_86'),
    (e.Element87 = 'minecraft:element_87'),
    (e.Element88 = 'minecraft:element_88'),
    (e.Element89 = 'minecraft:element_89'),
    (e.Element9 = 'minecraft:element_9'),
    (e.Element90 = 'minecraft:element_90'),
    (e.Element91 = 'minecraft:element_91'),
    (e.Element92 = 'minecraft:element_92'),
    (e.Element93 = 'minecraft:element_93'),
    (e.Element94 = 'minecraft:element_94'),
    (e.Element95 = 'minecraft:element_95'),
    (e.Element96 = 'minecraft:element_96'),
    (e.Element97 = 'minecraft:element_97'),
    (e.Element98 = 'minecraft:element_98'),
    (e.Element99 = 'minecraft:element_99'),
    (e.ElementConstructor = 'minecraft:element_constructor'),
    (e.EmeraldBlock = 'minecraft:emerald_block'),
    (e.EmeraldOre = 'minecraft:emerald_ore'),
    (e.EnchantingTable = 'minecraft:enchanting_table'),
    (e.EndBrickStairs = 'minecraft:end_brick_stairs'),
    (e.EndBricks = 'minecraft:end_bricks'),
    (e.EndPortal = 'minecraft:end_portal'),
    (e.EndPortalFrame = 'minecraft:end_portal_frame'),
    (e.EndRod = 'minecraft:end_rod'),
    (e.EndStone = 'minecraft:end_stone'),
    (e.EndStoneBrickDoubleSlab = 'minecraft:end_stone_brick_double_slab'),
    (e.EndStoneBrickSlab = 'minecraft:end_stone_brick_slab'),
    (e.EndStoneBrickWall = 'minecraft:end_stone_brick_wall'),
    (e.EnderChest = 'minecraft:ender_chest'),
    (e.ExposedChiseledCopper = 'minecraft:exposed_chiseled_copper'),
    (e.ExposedCopper = 'minecraft:exposed_copper'),
    (e.ExposedCopperBars = 'minecraft:exposed_copper_bars'),
    (e.ExposedCopperBulb = 'minecraft:exposed_copper_bulb'),
    (e.ExposedCopperChain = 'minecraft:exposed_copper_chain'),
    (e.ExposedCopperChest = 'minecraft:exposed_copper_chest'),
    (e.ExposedCopperDoor = 'minecraft:exposed_copper_door'),
    (e.ExposedCopperGolemStatue = 'minecraft:exposed_copper_golem_statue'),
    (e.ExposedCopperGrate = 'minecraft:exposed_copper_grate'),
    (e.ExposedCopperLantern = 'minecraft:exposed_copper_lantern'),
    (e.ExposedCopperTrapdoor = 'minecraft:exposed_copper_trapdoor'),
    (e.ExposedCutCopper = 'minecraft:exposed_cut_copper'),
    (e.ExposedCutCopperSlab = 'minecraft:exposed_cut_copper_slab'),
    (e.ExposedCutCopperStairs = 'minecraft:exposed_cut_copper_stairs'),
    (e.ExposedDoubleCutCopperSlab = 'minecraft:exposed_double_cut_copper_slab'),
    (e.ExposedLightningRod = 'minecraft:exposed_lightning_rod'),
    (e.Farmland = 'minecraft:farmland'),
    (e.FenceGate = 'minecraft:fence_gate'),
    (e.Fern = 'minecraft:fern'),
    (e.Fire = 'minecraft:fire'),
    (e.FireCoral = 'minecraft:fire_coral'),
    (e.FireCoralBlock = 'minecraft:fire_coral_block'),
    (e.FireCoralFan = 'minecraft:fire_coral_fan'),
    (e.FireCoralWallFan = 'minecraft:fire_coral_wall_fan'),
    (e.FireflyBush = 'minecraft:firefly_bush'),
    (e.FletchingTable = 'minecraft:fletching_table'),
    (e.FlowerPot = 'minecraft:flower_pot'),
    (e.FloweringAzalea = 'minecraft:flowering_azalea'),
    (e.FlowingLava = 'minecraft:flowing_lava'),
    (e.FlowingWater = 'minecraft:flowing_water'),
    (e.Frame = 'minecraft:frame'),
    (e.FrogSpawn = 'minecraft:frog_spawn'),
    (e.FrostedIce = 'minecraft:frosted_ice'),
    (e.Furnace = 'minecraft:furnace'),
    (e.GildedBlackstone = 'minecraft:gilded_blackstone'),
    (e.Glass = 'minecraft:glass'),
    (e.GlassPane = 'minecraft:glass_pane'),
    (e.GlowFrame = 'minecraft:glow_frame'),
    (e.GlowLichen = 'minecraft:glow_lichen'),
    (e.Glowstone = 'minecraft:glowstone'),
    (e.GoldBlock = 'minecraft:gold_block'),
    (e.GoldOre = 'minecraft:gold_ore'),
    (e.GoldenRail = 'minecraft:golden_rail'),
    (e.Granite = 'minecraft:granite'),
    (e.GraniteDoubleSlab = 'minecraft:granite_double_slab'),
    (e.GraniteSlab = 'minecraft:granite_slab'),
    (e.GraniteStairs = 'minecraft:granite_stairs'),
    (e.GraniteWall = 'minecraft:granite_wall'),
    (e.GrassBlock = 'minecraft:grass_block'),
    (e.GrassPath = 'minecraft:grass_path'),
    (e.Gravel = 'minecraft:gravel'),
    (e.GrayCandle = 'minecraft:gray_candle'),
    (e.GrayCandleCake = 'minecraft:gray_candle_cake'),
    (e.GrayCarpet = 'minecraft:gray_carpet'),
    (e.GrayConcrete = 'minecraft:gray_concrete'),
    (e.GrayConcretePowder = 'minecraft:gray_concrete_powder'),
    (e.GrayGlazedTerracotta = 'minecraft:gray_glazed_terracotta'),
    (e.GrayShulkerBox = 'minecraft:gray_shulker_box'),
    (e.GrayStainedGlass = 'minecraft:gray_stained_glass'),
    (e.GrayStainedGlassPane = 'minecraft:gray_stained_glass_pane'),
    (e.GrayTerracotta = 'minecraft:gray_terracotta'),
    (e.GrayWool = 'minecraft:gray_wool'),
    (e.GreenCandle = 'minecraft:green_candle'),
    (e.GreenCandleCake = 'minecraft:green_candle_cake'),
    (e.GreenCarpet = 'minecraft:green_carpet'),
    (e.GreenConcrete = 'minecraft:green_concrete'),
    (e.GreenConcretePowder = 'minecraft:green_concrete_powder'),
    (e.GreenGlazedTerracotta = 'minecraft:green_glazed_terracotta'),
    (e.GreenShulkerBox = 'minecraft:green_shulker_box'),
    (e.GreenStainedGlass = 'minecraft:green_stained_glass'),
    (e.GreenStainedGlassPane = 'minecraft:green_stained_glass_pane'),
    (e.GreenTerracotta = 'minecraft:green_terracotta'),
    (e.GreenWool = 'minecraft:green_wool'),
    (e.Grindstone = 'minecraft:grindstone'),
    (e.HangingRoots = 'minecraft:hanging_roots'),
    (e.HardBlackStainedGlass = 'minecraft:hard_black_stained_glass'),
    (e.HardBlackStainedGlassPane = 'minecraft:hard_black_stained_glass_pane'),
    (e.HardBlueStainedGlass = 'minecraft:hard_blue_stained_glass'),
    (e.HardBlueStainedGlassPane = 'minecraft:hard_blue_stained_glass_pane'),
    (e.HardBrownStainedGlass = 'minecraft:hard_brown_stained_glass'),
    (e.HardBrownStainedGlassPane = 'minecraft:hard_brown_stained_glass_pane'),
    (e.HardCyanStainedGlass = 'minecraft:hard_cyan_stained_glass'),
    (e.HardCyanStainedGlassPane = 'minecraft:hard_cyan_stained_glass_pane'),
    (e.HardGlass = 'minecraft:hard_glass'),
    (e.HardGlassPane = 'minecraft:hard_glass_pane'),
    (e.HardGrayStainedGlass = 'minecraft:hard_gray_stained_glass'),
    (e.HardGrayStainedGlassPane = 'minecraft:hard_gray_stained_glass_pane'),
    (e.HardGreenStainedGlass = 'minecraft:hard_green_stained_glass'),
    (e.HardGreenStainedGlassPane = 'minecraft:hard_green_stained_glass_pane'),
    (e.HardLightBlueStainedGlass = 'minecraft:hard_light_blue_stained_glass'),
    (e.HardLightBlueStainedGlassPane = 'minecraft:hard_light_blue_stained_glass_pane'),
    (e.HardLightGrayStainedGlass = 'minecraft:hard_light_gray_stained_glass'),
    (e.HardLightGrayStainedGlassPane = 'minecraft:hard_light_gray_stained_glass_pane'),
    (e.HardLimeStainedGlass = 'minecraft:hard_lime_stained_glass'),
    (e.HardLimeStainedGlassPane = 'minecraft:hard_lime_stained_glass_pane'),
    (e.HardMagentaStainedGlass = 'minecraft:hard_magenta_stained_glass'),
    (e.HardMagentaStainedGlassPane = 'minecraft:hard_magenta_stained_glass_pane'),
    (e.HardOrangeStainedGlass = 'minecraft:hard_orange_stained_glass'),
    (e.HardOrangeStainedGlassPane = 'minecraft:hard_orange_stained_glass_pane'),
    (e.HardPinkStainedGlass = 'minecraft:hard_pink_stained_glass'),
    (e.HardPinkStainedGlassPane = 'minecraft:hard_pink_stained_glass_pane'),
    (e.HardPurpleStainedGlass = 'minecraft:hard_purple_stained_glass'),
    (e.HardPurpleStainedGlassPane = 'minecraft:hard_purple_stained_glass_pane'),
    (e.HardRedStainedGlass = 'minecraft:hard_red_stained_glass'),
    (e.HardRedStainedGlassPane = 'minecraft:hard_red_stained_glass_pane'),
    (e.HardWhiteStainedGlass = 'minecraft:hard_white_stained_glass'),
    (e.HardWhiteStainedGlassPane = 'minecraft:hard_white_stained_glass_pane'),
    (e.HardYellowStainedGlass = 'minecraft:hard_yellow_stained_glass'),
    (e.HardYellowStainedGlassPane = 'minecraft:hard_yellow_stained_glass_pane'),
    (e.HardenedClay = 'minecraft:hardened_clay'),
    (e.HayBlock = 'minecraft:hay_block'),
    (e.HeavyCore = 'minecraft:heavy_core'),
    (e.HeavyWeightedPressurePlate = 'minecraft:heavy_weighted_pressure_plate'),
    (e.HoneyBlock = 'minecraft:honey_block'),
    (e.HoneycombBlock = 'minecraft:honeycomb_block'),
    (e.Hopper = 'minecraft:hopper'),
    (e.HornCoral = 'minecraft:horn_coral'),
    (e.HornCoralBlock = 'minecraft:horn_coral_block'),
    (e.HornCoralFan = 'minecraft:horn_coral_fan'),
    (e.HornCoralWallFan = 'minecraft:horn_coral_wall_fan'),
    (e.Ice = 'minecraft:ice'),
    (e.InfestedChiseledStoneBricks = 'minecraft:infested_chiseled_stone_bricks'),
    (e.InfestedCobblestone = 'minecraft:infested_cobblestone'),
    (e.InfestedCrackedStoneBricks = 'minecraft:infested_cracked_stone_bricks'),
    (e.InfestedDeepslate = 'minecraft:infested_deepslate'),
    (e.InfestedMossyStoneBricks = 'minecraft:infested_mossy_stone_bricks'),
    (e.InfestedStone = 'minecraft:infested_stone'),
    (e.InfestedStoneBricks = 'minecraft:infested_stone_bricks'),
    (e.IronBars = 'minecraft:iron_bars'),
    (e.IronBlock = 'minecraft:iron_block'),
    (e.IronChain = 'minecraft:iron_chain'),
    (e.IronDoor = 'minecraft:iron_door'),
    (e.IronOre = 'minecraft:iron_ore'),
    (e.IronTrapdoor = 'minecraft:iron_trapdoor'),
    (e.Jigsaw = 'minecraft:jigsaw'),
    (e.Jukebox = 'minecraft:jukebox'),
    (e.JungleButton = 'minecraft:jungle_button'),
    (e.JungleDoor = 'minecraft:jungle_door'),
    (e.JungleDoubleSlab = 'minecraft:jungle_double_slab'),
    (e.JungleFence = 'minecraft:jungle_fence'),
    (e.JungleFenceGate = 'minecraft:jungle_fence_gate'),
    (e.JungleHangingSign = 'minecraft:jungle_hanging_sign'),
    (e.JungleLeaves = 'minecraft:jungle_leaves'),
    (e.JungleLog = 'minecraft:jungle_log'),
    (e.JunglePlanks = 'minecraft:jungle_planks'),
    (e.JunglePressurePlate = 'minecraft:jungle_pressure_plate'),
    (e.JungleSapling = 'minecraft:jungle_sapling'),
    (e.JungleShelf = 'minecraft:jungle_shelf'),
    (e.JungleSlab = 'minecraft:jungle_slab'),
    (e.JungleStairs = 'minecraft:jungle_stairs'),
    (e.JungleStandingSign = 'minecraft:jungle_standing_sign'),
    (e.JungleTrapdoor = 'minecraft:jungle_trapdoor'),
    (e.JungleWallSign = 'minecraft:jungle_wall_sign'),
    (e.JungleWood = 'minecraft:jungle_wood'),
    (e.Kelp = 'minecraft:kelp'),
    (e.LabTable = 'minecraft:lab_table'),
    (e.Ladder = 'minecraft:ladder'),
    (e.Lantern = 'minecraft:lantern'),
    (e.LapisBlock = 'minecraft:lapis_block'),
    (e.LapisOre = 'minecraft:lapis_ore'),
    (e.LargeAmethystBud = 'minecraft:large_amethyst_bud'),
    (e.LargeFern = 'minecraft:large_fern'),
    (e.Lava = 'minecraft:lava'),
    (e.LeafLitter = 'minecraft:leaf_litter'),
    (e.Lectern = 'minecraft:lectern'),
    (e.Lever = 'minecraft:lever'),
    (e.LightBlock0 = 'minecraft:light_block_0'),
    (e.LightBlock1 = 'minecraft:light_block_1'),
    (e.LightBlock10 = 'minecraft:light_block_10'),
    (e.LightBlock11 = 'minecraft:light_block_11'),
    (e.LightBlock12 = 'minecraft:light_block_12'),
    (e.LightBlock13 = 'minecraft:light_block_13'),
    (e.LightBlock14 = 'minecraft:light_block_14'),
    (e.LightBlock15 = 'minecraft:light_block_15'),
    (e.LightBlock2 = 'minecraft:light_block_2'),
    (e.LightBlock3 = 'minecraft:light_block_3'),
    (e.LightBlock4 = 'minecraft:light_block_4'),
    (e.LightBlock5 = 'minecraft:light_block_5'),
    (e.LightBlock6 = 'minecraft:light_block_6'),
    (e.LightBlock7 = 'minecraft:light_block_7'),
    (e.LightBlock8 = 'minecraft:light_block_8'),
    (e.LightBlock9 = 'minecraft:light_block_9'),
    (e.LightBlueCandle = 'minecraft:light_blue_candle'),
    (e.LightBlueCandleCake = 'minecraft:light_blue_candle_cake'),
    (e.LightBlueCarpet = 'minecraft:light_blue_carpet'),
    (e.LightBlueConcrete = 'minecraft:light_blue_concrete'),
    (e.LightBlueConcretePowder = 'minecraft:light_blue_concrete_powder'),
    (e.LightBlueGlazedTerracotta = 'minecraft:light_blue_glazed_terracotta'),
    (e.LightBlueShulkerBox = 'minecraft:light_blue_shulker_box'),
    (e.LightBlueStainedGlass = 'minecraft:light_blue_stained_glass'),
    (e.LightBlueStainedGlassPane = 'minecraft:light_blue_stained_glass_pane'),
    (e.LightBlueTerracotta = 'minecraft:light_blue_terracotta'),
    (e.LightBlueWool = 'minecraft:light_blue_wool'),
    (e.LightGrayCandle = 'minecraft:light_gray_candle'),
    (e.LightGrayCandleCake = 'minecraft:light_gray_candle_cake'),
    (e.LightGrayCarpet = 'minecraft:light_gray_carpet'),
    (e.LightGrayConcrete = 'minecraft:light_gray_concrete'),
    (e.LightGrayConcretePowder = 'minecraft:light_gray_concrete_powder'),
    (e.LightGrayShulkerBox = 'minecraft:light_gray_shulker_box'),
    (e.LightGrayStainedGlass = 'minecraft:light_gray_stained_glass'),
    (e.LightGrayStainedGlassPane = 'minecraft:light_gray_stained_glass_pane'),
    (e.LightGrayTerracotta = 'minecraft:light_gray_terracotta'),
    (e.LightGrayWool = 'minecraft:light_gray_wool'),
    (e.LightWeightedPressurePlate = 'minecraft:light_weighted_pressure_plate'),
    (e.LightningRod = 'minecraft:lightning_rod'),
    (e.Lilac = 'minecraft:lilac'),
    (e.LilyOfTheValley = 'minecraft:lily_of_the_valley'),
    (e.LimeCandle = 'minecraft:lime_candle'),
    (e.LimeCandleCake = 'minecraft:lime_candle_cake'),
    (e.LimeCarpet = 'minecraft:lime_carpet'),
    (e.LimeConcrete = 'minecraft:lime_concrete'),
    (e.LimeConcretePowder = 'minecraft:lime_concrete_powder'),
    (e.LimeGlazedTerracotta = 'minecraft:lime_glazed_terracotta'),
    (e.LimeShulkerBox = 'minecraft:lime_shulker_box'),
    (e.LimeStainedGlass = 'minecraft:lime_stained_glass'),
    (e.LimeStainedGlassPane = 'minecraft:lime_stained_glass_pane'),
    (e.LimeTerracotta = 'minecraft:lime_terracotta'),
    (e.LimeWool = 'minecraft:lime_wool'),
    (e.LitBlastFurnace = 'minecraft:lit_blast_furnace'),
    (e.LitDeepslateRedstoneOre = 'minecraft:lit_deepslate_redstone_ore'),
    (e.LitFurnace = 'minecraft:lit_furnace'),
    (e.LitPumpkin = 'minecraft:lit_pumpkin'),
    (e.LitRedstoneLamp = 'minecraft:lit_redstone_lamp'),
    (e.LitRedstoneOre = 'minecraft:lit_redstone_ore'),
    (e.LitSmoker = 'minecraft:lit_smoker'),
    (e.Lodestone = 'minecraft:lodestone'),
    (e.Loom = 'minecraft:loom'),
    (e.MagentaCandle = 'minecraft:magenta_candle'),
    (e.MagentaCandleCake = 'minecraft:magenta_candle_cake'),
    (e.MagentaCarpet = 'minecraft:magenta_carpet'),
    (e.MagentaConcrete = 'minecraft:magenta_concrete'),
    (e.MagentaConcretePowder = 'minecraft:magenta_concrete_powder'),
    (e.MagentaGlazedTerracotta = 'minecraft:magenta_glazed_terracotta'),
    (e.MagentaShulkerBox = 'minecraft:magenta_shulker_box'),
    (e.MagentaStainedGlass = 'minecraft:magenta_stained_glass'),
    (e.MagentaStainedGlassPane = 'minecraft:magenta_stained_glass_pane'),
    (e.MagentaTerracotta = 'minecraft:magenta_terracotta'),
    (e.MagentaWool = 'minecraft:magenta_wool'),
    (e.Magma = 'minecraft:magma'),
    (e.MangroveButton = 'minecraft:mangrove_button'),
    (e.MangroveDoor = 'minecraft:mangrove_door'),
    (e.MangroveDoubleSlab = 'minecraft:mangrove_double_slab'),
    (e.MangroveFence = 'minecraft:mangrove_fence'),
    (e.MangroveFenceGate = 'minecraft:mangrove_fence_gate'),
    (e.MangroveHangingSign = 'minecraft:mangrove_hanging_sign'),
    (e.MangroveLeaves = 'minecraft:mangrove_leaves'),
    (e.MangroveLog = 'minecraft:mangrove_log'),
    (e.MangrovePlanks = 'minecraft:mangrove_planks'),
    (e.MangrovePressurePlate = 'minecraft:mangrove_pressure_plate'),
    (e.MangrovePropagule = 'minecraft:mangrove_propagule'),
    (e.MangroveRoots = 'minecraft:mangrove_roots'),
    (e.MangroveShelf = 'minecraft:mangrove_shelf'),
    (e.MangroveSlab = 'minecraft:mangrove_slab'),
    (e.MangroveStairs = 'minecraft:mangrove_stairs'),
    (e.MangroveStandingSign = 'minecraft:mangrove_standing_sign'),
    (e.MangroveTrapdoor = 'minecraft:mangrove_trapdoor'),
    (e.MangroveWallSign = 'minecraft:mangrove_wall_sign'),
    (e.MangroveWood = 'minecraft:mangrove_wood'),
    (e.MaterialReducer = 'minecraft:material_reducer'),
    (e.MediumAmethystBud = 'minecraft:medium_amethyst_bud'),
    (e.MelonBlock = 'minecraft:melon_block'),
    (e.MelonStem = 'minecraft:melon_stem'),
    (e.MobSpawner = 'minecraft:mob_spawner'),
    (e.MossBlock = 'minecraft:moss_block'),
    (e.MossCarpet = 'minecraft:moss_carpet'),
    (e.MossyCobblestone = 'minecraft:mossy_cobblestone'),
    (e.MossyCobblestoneDoubleSlab = 'minecraft:mossy_cobblestone_double_slab'),
    (e.MossyCobblestoneSlab = 'minecraft:mossy_cobblestone_slab'),
    (e.MossyCobblestoneStairs = 'minecraft:mossy_cobblestone_stairs'),
    (e.MossyCobblestoneWall = 'minecraft:mossy_cobblestone_wall'),
    (e.MossyStoneBrickDoubleSlab = 'minecraft:mossy_stone_brick_double_slab'),
    (e.MossyStoneBrickSlab = 'minecraft:mossy_stone_brick_slab'),
    (e.MossyStoneBrickStairs = 'minecraft:mossy_stone_brick_stairs'),
    (e.MossyStoneBrickWall = 'minecraft:mossy_stone_brick_wall'),
    (e.MossyStoneBricks = 'minecraft:mossy_stone_bricks'),
    (e.Mud = 'minecraft:mud'),
    (e.MudBrickDoubleSlab = 'minecraft:mud_brick_double_slab'),
    (e.MudBrickSlab = 'minecraft:mud_brick_slab'),
    (e.MudBrickStairs = 'minecraft:mud_brick_stairs'),
    (e.MudBrickWall = 'minecraft:mud_brick_wall'),
    (e.MudBricks = 'minecraft:mud_bricks'),
    (e.MuddyMangroveRoots = 'minecraft:muddy_mangrove_roots'),
    (e.MushroomStem = 'minecraft:mushroom_stem'),
    (e.Mycelium = 'minecraft:mycelium'),
    (e.NetherBrick = 'minecraft:nether_brick'),
    (e.NetherBrickDoubleSlab = 'minecraft:nether_brick_double_slab'),
    (e.NetherBrickFence = 'minecraft:nether_brick_fence'),
    (e.NetherBrickSlab = 'minecraft:nether_brick_slab'),
    (e.NetherBrickStairs = 'minecraft:nether_brick_stairs'),
    (e.NetherBrickWall = 'minecraft:nether_brick_wall'),
    (e.NetherGoldOre = 'minecraft:nether_gold_ore'),
    (e.NetherSprouts = 'minecraft:nether_sprouts'),
    (e.NetherWart = 'minecraft:nether_wart'),
    (e.NetherWartBlock = 'minecraft:nether_wart_block'),
    (e.NetheriteBlock = 'minecraft:netherite_block'),
    (e.Netherrack = 'minecraft:netherrack'),
    (e.NormalStoneDoubleSlab = 'minecraft:normal_stone_double_slab'),
    (e.NormalStoneSlab = 'minecraft:normal_stone_slab'),
    (e.NormalStoneStairs = 'minecraft:normal_stone_stairs'),
    (e.Noteblock = 'minecraft:noteblock'),
    (e.OakDoubleSlab = 'minecraft:oak_double_slab'),
    (e.OakFence = 'minecraft:oak_fence'),
    (e.OakHangingSign = 'minecraft:oak_hanging_sign'),
    (e.OakLeaves = 'minecraft:oak_leaves'),
    (e.OakLog = 'minecraft:oak_log'),
    (e.OakPlanks = 'minecraft:oak_planks'),
    (e.OakSapling = 'minecraft:oak_sapling'),
    (e.OakShelf = 'minecraft:oak_shelf'),
    (e.OakSlab = 'minecraft:oak_slab'),
    (e.OakStairs = 'minecraft:oak_stairs'),
    (e.OakWood = 'minecraft:oak_wood'),
    (e.Observer = 'minecraft:observer'),
    (e.Obsidian = 'minecraft:obsidian'),
    (e.OchreFroglight = 'minecraft:ochre_froglight'),
    (e.OpenEyeblossom = 'minecraft:open_eyeblossom'),
    (e.OrangeCandle = 'minecraft:orange_candle'),
    (e.OrangeCandleCake = 'minecraft:orange_candle_cake'),
    (e.OrangeCarpet = 'minecraft:orange_carpet'),
    (e.OrangeConcrete = 'minecraft:orange_concrete'),
    (e.OrangeConcretePowder = 'minecraft:orange_concrete_powder'),
    (e.OrangeGlazedTerracotta = 'minecraft:orange_glazed_terracotta'),
    (e.OrangeShulkerBox = 'minecraft:orange_shulker_box'),
    (e.OrangeStainedGlass = 'minecraft:orange_stained_glass'),
    (e.OrangeStainedGlassPane = 'minecraft:orange_stained_glass_pane'),
    (e.OrangeTerracotta = 'minecraft:orange_terracotta'),
    (e.OrangeTulip = 'minecraft:orange_tulip'),
    (e.OrangeWool = 'minecraft:orange_wool'),
    (e.OxeyeDaisy = 'minecraft:oxeye_daisy'),
    (e.OxidizedChiseledCopper = 'minecraft:oxidized_chiseled_copper'),
    (e.OxidizedCopper = 'minecraft:oxidized_copper'),
    (e.OxidizedCopperBars = 'minecraft:oxidized_copper_bars'),
    (e.OxidizedCopperBulb = 'minecraft:oxidized_copper_bulb'),
    (e.OxidizedCopperChain = 'minecraft:oxidized_copper_chain'),
    (e.OxidizedCopperChest = 'minecraft:oxidized_copper_chest'),
    (e.OxidizedCopperDoor = 'minecraft:oxidized_copper_door'),
    (e.OxidizedCopperGolemStatue = 'minecraft:oxidized_copper_golem_statue'),
    (e.OxidizedCopperGrate = 'minecraft:oxidized_copper_grate'),
    (e.OxidizedCopperLantern = 'minecraft:oxidized_copper_lantern'),
    (e.OxidizedCopperTrapdoor = 'minecraft:oxidized_copper_trapdoor'),
    (e.OxidizedCutCopper = 'minecraft:oxidized_cut_copper'),
    (e.OxidizedCutCopperSlab = 'minecraft:oxidized_cut_copper_slab'),
    (e.OxidizedCutCopperStairs = 'minecraft:oxidized_cut_copper_stairs'),
    (e.OxidizedDoubleCutCopperSlab = 'minecraft:oxidized_double_cut_copper_slab'),
    (e.OxidizedLightningRod = 'minecraft:oxidized_lightning_rod'),
    (e.PackedIce = 'minecraft:packed_ice'),
    (e.PackedMud = 'minecraft:packed_mud'),
    (e.PaleHangingMoss = 'minecraft:pale_hanging_moss'),
    (e.PaleMossBlock = 'minecraft:pale_moss_block'),
    (e.PaleMossCarpet = 'minecraft:pale_moss_carpet'),
    (e.PaleOakButton = 'minecraft:pale_oak_button'),
    (e.PaleOakDoor = 'minecraft:pale_oak_door'),
    (e.PaleOakDoubleSlab = 'minecraft:pale_oak_double_slab'),
    (e.PaleOakFence = 'minecraft:pale_oak_fence'),
    (e.PaleOakFenceGate = 'minecraft:pale_oak_fence_gate'),
    (e.PaleOakHangingSign = 'minecraft:pale_oak_hanging_sign'),
    (e.PaleOakLeaves = 'minecraft:pale_oak_leaves'),
    (e.PaleOakLog = 'minecraft:pale_oak_log'),
    (e.PaleOakPlanks = 'minecraft:pale_oak_planks'),
    (e.PaleOakPressurePlate = 'minecraft:pale_oak_pressure_plate'),
    (e.PaleOakSapling = 'minecraft:pale_oak_sapling'),
    (e.PaleOakShelf = 'minecraft:pale_oak_shelf'),
    (e.PaleOakSlab = 'minecraft:pale_oak_slab'),
    (e.PaleOakStairs = 'minecraft:pale_oak_stairs'),
    (e.PaleOakStandingSign = 'minecraft:pale_oak_standing_sign'),
    (e.PaleOakTrapdoor = 'minecraft:pale_oak_trapdoor'),
    (e.PaleOakWallSign = 'minecraft:pale_oak_wall_sign'),
    (e.PaleOakWood = 'minecraft:pale_oak_wood'),
    (e.PearlescentFroglight = 'minecraft:pearlescent_froglight'),
    (e.Peony = 'minecraft:peony'),
    (e.PetrifiedOakDoubleSlab = 'minecraft:petrified_oak_double_slab'),
    (e.PetrifiedOakSlab = 'minecraft:petrified_oak_slab'),
    (e.PiglinHead = 'minecraft:piglin_head'),
    (e.PinkCandle = 'minecraft:pink_candle'),
    (e.PinkCandleCake = 'minecraft:pink_candle_cake'),
    (e.PinkCarpet = 'minecraft:pink_carpet'),
    (e.PinkConcrete = 'minecraft:pink_concrete'),
    (e.PinkConcretePowder = 'minecraft:pink_concrete_powder'),
    (e.PinkGlazedTerracotta = 'minecraft:pink_glazed_terracotta'),
    (e.PinkPetals = 'minecraft:pink_petals'),
    (e.PinkShulkerBox = 'minecraft:pink_shulker_box'),
    (e.PinkStainedGlass = 'minecraft:pink_stained_glass'),
    (e.PinkStainedGlassPane = 'minecraft:pink_stained_glass_pane'),
    (e.PinkTerracotta = 'minecraft:pink_terracotta'),
    (e.PinkTulip = 'minecraft:pink_tulip'),
    (e.PinkWool = 'minecraft:pink_wool'),
    (e.Piston = 'minecraft:piston'),
    (e.PistonArmCollision = 'minecraft:piston_arm_collision'),
    (e.PitcherCrop = 'minecraft:pitcher_crop'),
    (e.PitcherPlant = 'minecraft:pitcher_plant'),
    (e.PlayerHead = 'minecraft:player_head'),
    (e.Podzol = 'minecraft:podzol'),
    (e.PointedDripstone = 'minecraft:pointed_dripstone'),
    (e.PolishedAndesite = 'minecraft:polished_andesite'),
    (e.PolishedAndesiteDoubleSlab = 'minecraft:polished_andesite_double_slab'),
    (e.PolishedAndesiteSlab = 'minecraft:polished_andesite_slab'),
    (e.PolishedAndesiteStairs = 'minecraft:polished_andesite_stairs'),
    (e.PolishedBasalt = 'minecraft:polished_basalt'),
    (e.PolishedBlackstone = 'minecraft:polished_blackstone'),
    (e.PolishedBlackstoneBrickDoubleSlab = 'minecraft:polished_blackstone_brick_double_slab'),
    (e.PolishedBlackstoneBrickSlab = 'minecraft:polished_blackstone_brick_slab'),
    (e.PolishedBlackstoneBrickStairs = 'minecraft:polished_blackstone_brick_stairs'),
    (e.PolishedBlackstoneBrickWall = 'minecraft:polished_blackstone_brick_wall'),
    (e.PolishedBlackstoneBricks = 'minecraft:polished_blackstone_bricks'),
    (e.PolishedBlackstoneButton = 'minecraft:polished_blackstone_button'),
    (e.PolishedBlackstoneDoubleSlab = 'minecraft:polished_blackstone_double_slab'),
    (e.PolishedBlackstonePressurePlate = 'minecraft:polished_blackstone_pressure_plate'),
    (e.PolishedBlackstoneSlab = 'minecraft:polished_blackstone_slab'),
    (e.PolishedBlackstoneStairs = 'minecraft:polished_blackstone_stairs'),
    (e.PolishedBlackstoneWall = 'minecraft:polished_blackstone_wall'),
    (e.PolishedDeepslate = 'minecraft:polished_deepslate'),
    (e.PolishedDeepslateDoubleSlab = 'minecraft:polished_deepslate_double_slab'),
    (e.PolishedDeepslateSlab = 'minecraft:polished_deepslate_slab'),
    (e.PolishedDeepslateStairs = 'minecraft:polished_deepslate_stairs'),
    (e.PolishedDeepslateWall = 'minecraft:polished_deepslate_wall'),
    (e.PolishedDiorite = 'minecraft:polished_diorite'),
    (e.PolishedDioriteDoubleSlab = 'minecraft:polished_diorite_double_slab'),
    (e.PolishedDioriteSlab = 'minecraft:polished_diorite_slab'),
    (e.PolishedDioriteStairs = 'minecraft:polished_diorite_stairs'),
    (e.PolishedGranite = 'minecraft:polished_granite'),
    (e.PolishedGraniteDoubleSlab = 'minecraft:polished_granite_double_slab'),
    (e.PolishedGraniteSlab = 'minecraft:polished_granite_slab'),
    (e.PolishedGraniteStairs = 'minecraft:polished_granite_stairs'),
    (e.PolishedTuff = 'minecraft:polished_tuff'),
    (e.PolishedTuffDoubleSlab = 'minecraft:polished_tuff_double_slab'),
    (e.PolishedTuffSlab = 'minecraft:polished_tuff_slab'),
    (e.PolishedTuffStairs = 'minecraft:polished_tuff_stairs'),
    (e.PolishedTuffWall = 'minecraft:polished_tuff_wall'),
    (e.Poppy = 'minecraft:poppy'),
    (e.Portal = 'minecraft:portal'),
    (e.Potatoes = 'minecraft:potatoes'),
    (e.PowderSnow = 'minecraft:powder_snow'),
    (e.PoweredComparator = 'minecraft:powered_comparator'),
    (e.PoweredRepeater = 'minecraft:powered_repeater'),
    (e.Prismarine = 'minecraft:prismarine'),
    (e.PrismarineBrickDoubleSlab = 'minecraft:prismarine_brick_double_slab'),
    (e.PrismarineBrickSlab = 'minecraft:prismarine_brick_slab'),
    (e.PrismarineBricks = 'minecraft:prismarine_bricks'),
    (e.PrismarineBricksStairs = 'minecraft:prismarine_bricks_stairs'),
    (e.PrismarineDoubleSlab = 'minecraft:prismarine_double_slab'),
    (e.PrismarineSlab = 'minecraft:prismarine_slab'),
    (e.PrismarineStairs = 'minecraft:prismarine_stairs'),
    (e.PrismarineWall = 'minecraft:prismarine_wall'),
    (e.Pumpkin = 'minecraft:pumpkin'),
    (e.PumpkinStem = 'minecraft:pumpkin_stem'),
    (e.PurpleCandle = 'minecraft:purple_candle'),
    (e.PurpleCandleCake = 'minecraft:purple_candle_cake'),
    (e.PurpleCarpet = 'minecraft:purple_carpet'),
    (e.PurpleConcrete = 'minecraft:purple_concrete'),
    (e.PurpleConcretePowder = 'minecraft:purple_concrete_powder'),
    (e.PurpleGlazedTerracotta = 'minecraft:purple_glazed_terracotta'),
    (e.PurpleShulkerBox = 'minecraft:purple_shulker_box'),
    (e.PurpleStainedGlass = 'minecraft:purple_stained_glass'),
    (e.PurpleStainedGlassPane = 'minecraft:purple_stained_glass_pane'),
    (e.PurpleTerracotta = 'minecraft:purple_terracotta'),
    (e.PurpleWool = 'minecraft:purple_wool'),
    (e.PurpurBlock = 'minecraft:purpur_block'),
    (e.PurpurDoubleSlab = 'minecraft:purpur_double_slab'),
    (e.PurpurPillar = 'minecraft:purpur_pillar'),
    (e.PurpurSlab = 'minecraft:purpur_slab'),
    (e.PurpurStairs = 'minecraft:purpur_stairs'),
    (e.QuartzBlock = 'minecraft:quartz_block'),
    (e.QuartzBricks = 'minecraft:quartz_bricks'),
    (e.QuartzDoubleSlab = 'minecraft:quartz_double_slab'),
    (e.QuartzOre = 'minecraft:quartz_ore'),
    (e.QuartzPillar = 'minecraft:quartz_pillar'),
    (e.QuartzSlab = 'minecraft:quartz_slab'),
    (e.QuartzStairs = 'minecraft:quartz_stairs'),
    (e.Rail = 'minecraft:rail'),
    (e.RawCopperBlock = 'minecraft:raw_copper_block'),
    (e.RawGoldBlock = 'minecraft:raw_gold_block'),
    (e.RawIronBlock = 'minecraft:raw_iron_block'),
    (e.RedCandle = 'minecraft:red_candle'),
    (e.RedCandleCake = 'minecraft:red_candle_cake'),
    (e.RedCarpet = 'minecraft:red_carpet'),
    (e.RedConcrete = 'minecraft:red_concrete'),
    (e.RedConcretePowder = 'minecraft:red_concrete_powder'),
    (e.RedGlazedTerracotta = 'minecraft:red_glazed_terracotta'),
    (e.RedMushroom = 'minecraft:red_mushroom'),
    (e.RedMushroomBlock = 'minecraft:red_mushroom_block'),
    (e.RedNetherBrick = 'minecraft:red_nether_brick'),
    (e.RedNetherBrickDoubleSlab = 'minecraft:red_nether_brick_double_slab'),
    (e.RedNetherBrickSlab = 'minecraft:red_nether_brick_slab'),
    (e.RedNetherBrickStairs = 'minecraft:red_nether_brick_stairs'),
    (e.RedNetherBrickWall = 'minecraft:red_nether_brick_wall'),
    (e.RedSand = 'minecraft:red_sand'),
    (e.RedSandstone = 'minecraft:red_sandstone'),
    (e.RedSandstoneDoubleSlab = 'minecraft:red_sandstone_double_slab'),
    (e.RedSandstoneSlab = 'minecraft:red_sandstone_slab'),
    (e.RedSandstoneStairs = 'minecraft:red_sandstone_stairs'),
    (e.RedSandstoneWall = 'minecraft:red_sandstone_wall'),
    (e.RedShulkerBox = 'minecraft:red_shulker_box'),
    (e.RedStainedGlass = 'minecraft:red_stained_glass'),
    (e.RedStainedGlassPane = 'minecraft:red_stained_glass_pane'),
    (e.RedTerracotta = 'minecraft:red_terracotta'),
    (e.RedTulip = 'minecraft:red_tulip'),
    (e.RedWool = 'minecraft:red_wool'),
    (e.RedstoneBlock = 'minecraft:redstone_block'),
    (e.RedstoneLamp = 'minecraft:redstone_lamp'),
    (e.RedstoneOre = 'minecraft:redstone_ore'),
    (e.RedstoneTorch = 'minecraft:redstone_torch'),
    (e.RedstoneWire = 'minecraft:redstone_wire'),
    (e.Reeds = 'minecraft:reeds'),
    (e.ReinforcedDeepslate = 'minecraft:reinforced_deepslate'),
    (e.RepeatingCommandBlock = 'minecraft:repeating_command_block'),
    (e.ResinBlock = 'minecraft:resin_block'),
    (e.ResinBrickDoubleSlab = 'minecraft:resin_brick_double_slab'),
    (e.ResinBrickSlab = 'minecraft:resin_brick_slab'),
    (e.ResinBrickStairs = 'minecraft:resin_brick_stairs'),
    (e.ResinBrickWall = 'minecraft:resin_brick_wall'),
    (e.ResinBricks = 'minecraft:resin_bricks'),
    (e.ResinClump = 'minecraft:resin_clump'),
    (e.RespawnAnchor = 'minecraft:respawn_anchor'),
    (e.RoseBush = 'minecraft:rose_bush'),
    (e.Sand = 'minecraft:sand'),
    (e.Sandstone = 'minecraft:sandstone'),
    (e.SandstoneDoubleSlab = 'minecraft:sandstone_double_slab'),
    (e.SandstoneSlab = 'minecraft:sandstone_slab'),
    (e.SandstoneStairs = 'minecraft:sandstone_stairs'),
    (e.SandstoneWall = 'minecraft:sandstone_wall'),
    (e.Scaffolding = 'minecraft:scaffolding'),
    (e.Sculk = 'minecraft:sculk'),
    (e.SculkCatalyst = 'minecraft:sculk_catalyst'),
    (e.SculkSensor = 'minecraft:sculk_sensor'),
    (e.SculkShrieker = 'minecraft:sculk_shrieker'),
    (e.SculkVein = 'minecraft:sculk_vein'),
    (e.SeaLantern = 'minecraft:sea_lantern'),
    (e.SeaPickle = 'minecraft:sea_pickle'),
    (e.Seagrass = 'minecraft:seagrass'),
    (e.ShortDryGrass = 'minecraft:short_dry_grass'),
    (e.ShortGrass = 'minecraft:short_grass'),
    (e.Shroomlight = 'minecraft:shroomlight'),
    (e.SilverGlazedTerracotta = 'minecraft:silver_glazed_terracotta'),
    (e.SkeletonSkull = 'minecraft:skeleton_skull'),
    (e.Slime = 'minecraft:slime'),
    (e.SmallAmethystBud = 'minecraft:small_amethyst_bud'),
    (e.SmallDripleafBlock = 'minecraft:small_dripleaf_block'),
    (e.SmithingTable = 'minecraft:smithing_table'),
    (e.Smoker = 'minecraft:smoker'),
    (e.SmoothBasalt = 'minecraft:smooth_basalt'),
    (e.SmoothQuartz = 'minecraft:smooth_quartz'),
    (e.SmoothQuartzDoubleSlab = 'minecraft:smooth_quartz_double_slab'),
    (e.SmoothQuartzSlab = 'minecraft:smooth_quartz_slab'),
    (e.SmoothQuartzStairs = 'minecraft:smooth_quartz_stairs'),
    (e.SmoothRedSandstone = 'minecraft:smooth_red_sandstone'),
    (e.SmoothRedSandstoneDoubleSlab = 'minecraft:smooth_red_sandstone_double_slab'),
    (e.SmoothRedSandstoneSlab = 'minecraft:smooth_red_sandstone_slab'),
    (e.SmoothRedSandstoneStairs = 'minecraft:smooth_red_sandstone_stairs'),
    (e.SmoothSandstone = 'minecraft:smooth_sandstone'),
    (e.SmoothSandstoneDoubleSlab = 'minecraft:smooth_sandstone_double_slab'),
    (e.SmoothSandstoneSlab = 'minecraft:smooth_sandstone_slab'),
    (e.SmoothSandstoneStairs = 'minecraft:smooth_sandstone_stairs'),
    (e.SmoothStone = 'minecraft:smooth_stone'),
    (e.SmoothStoneDoubleSlab = 'minecraft:smooth_stone_double_slab'),
    (e.SmoothStoneSlab = 'minecraft:smooth_stone_slab'),
    (e.SnifferEgg = 'minecraft:sniffer_egg'),
    (e.Snow = 'minecraft:snow'),
    (e.SnowLayer = 'minecraft:snow_layer'),
    (e.SoulCampfire = 'minecraft:soul_campfire'),
    (e.SoulFire = 'minecraft:soul_fire'),
    (e.SoulLantern = 'minecraft:soul_lantern'),
    (e.SoulSand = 'minecraft:soul_sand'),
    (e.SoulSoil = 'minecraft:soul_soil'),
    (e.SoulTorch = 'minecraft:soul_torch'),
    (e.Sponge = 'minecraft:sponge'),
    (e.SporeBlossom = 'minecraft:spore_blossom'),
    (e.SpruceButton = 'minecraft:spruce_button'),
    (e.SpruceDoor = 'minecraft:spruce_door'),
    (e.SpruceDoubleSlab = 'minecraft:spruce_double_slab'),
    (e.SpruceFence = 'minecraft:spruce_fence'),
    (e.SpruceFenceGate = 'minecraft:spruce_fence_gate'),
    (e.SpruceHangingSign = 'minecraft:spruce_hanging_sign'),
    (e.SpruceLeaves = 'minecraft:spruce_leaves'),
    (e.SpruceLog = 'minecraft:spruce_log'),
    (e.SprucePlanks = 'minecraft:spruce_planks'),
    (e.SprucePressurePlate = 'minecraft:spruce_pressure_plate'),
    (e.SpruceSapling = 'minecraft:spruce_sapling'),
    (e.SpruceShelf = 'minecraft:spruce_shelf'),
    (e.SpruceSlab = 'minecraft:spruce_slab'),
    (e.SpruceStairs = 'minecraft:spruce_stairs'),
    (e.SpruceStandingSign = 'minecraft:spruce_standing_sign'),
    (e.SpruceTrapdoor = 'minecraft:spruce_trapdoor'),
    (e.SpruceWallSign = 'minecraft:spruce_wall_sign'),
    (e.SpruceWood = 'minecraft:spruce_wood'),
    (e.StandingBanner = 'minecraft:standing_banner'),
    (e.StandingSign = 'minecraft:standing_sign'),
    (e.StickyPiston = 'minecraft:sticky_piston'),
    (e.StickyPistonArmCollision = 'minecraft:sticky_piston_arm_collision'),
    (e.Stone = 'minecraft:stone'),
    (e.StoneBrickDoubleSlab = 'minecraft:stone_brick_double_slab'),
    (e.StoneBrickSlab = 'minecraft:stone_brick_slab'),
    (e.StoneBrickStairs = 'minecraft:stone_brick_stairs'),
    (e.StoneBrickWall = 'minecraft:stone_brick_wall'),
    (e.StoneBricks = 'minecraft:stone_bricks'),
    (e.StoneButton = 'minecraft:stone_button'),
    (e.StonePressurePlate = 'minecraft:stone_pressure_plate'),
    (e.StoneStairs = 'minecraft:stone_stairs'),
    (e.StonecutterBlock = 'minecraft:stonecutter_block'),
    (e.StrippedAcaciaLog = 'minecraft:stripped_acacia_log'),
    (e.StrippedAcaciaWood = 'minecraft:stripped_acacia_wood'),
    (e.StrippedBambooBlock = 'minecraft:stripped_bamboo_block'),
    (e.StrippedBirchLog = 'minecraft:stripped_birch_log'),
    (e.StrippedBirchWood = 'minecraft:stripped_birch_wood'),
    (e.StrippedCherryLog = 'minecraft:stripped_cherry_log'),
    (e.StrippedCherryWood = 'minecraft:stripped_cherry_wood'),
    (e.StrippedCrimsonHyphae = 'minecraft:stripped_crimson_hyphae'),
    (e.StrippedCrimsonStem = 'minecraft:stripped_crimson_stem'),
    (e.StrippedDarkOakLog = 'minecraft:stripped_dark_oak_log'),
    (e.StrippedDarkOakWood = 'minecraft:stripped_dark_oak_wood'),
    (e.StrippedJungleLog = 'minecraft:stripped_jungle_log'),
    (e.StrippedJungleWood = 'minecraft:stripped_jungle_wood'),
    (e.StrippedMangroveLog = 'minecraft:stripped_mangrove_log'),
    (e.StrippedMangroveWood = 'minecraft:stripped_mangrove_wood'),
    (e.StrippedOakLog = 'minecraft:stripped_oak_log'),
    (e.StrippedOakWood = 'minecraft:stripped_oak_wood'),
    (e.StrippedPaleOakLog = 'minecraft:stripped_pale_oak_log'),
    (e.StrippedPaleOakWood = 'minecraft:stripped_pale_oak_wood'),
    (e.StrippedSpruceLog = 'minecraft:stripped_spruce_log'),
    (e.StrippedSpruceWood = 'minecraft:stripped_spruce_wood'),
    (e.StrippedWarpedHyphae = 'minecraft:stripped_warped_hyphae'),
    (e.StrippedWarpedStem = 'minecraft:stripped_warped_stem'),
    (e.StructureBlock = 'minecraft:structure_block'),
    (e.StructureVoid = 'minecraft:structure_void'),
    (e.Sunflower = 'minecraft:sunflower'),
    (e.SuspiciousGravel = 'minecraft:suspicious_gravel'),
    (e.SuspiciousSand = 'minecraft:suspicious_sand'),
    (e.SweetBerryBush = 'minecraft:sweet_berry_bush'),
    (e.TallDryGrass = 'minecraft:tall_dry_grass'),
    (e.TallGrass = 'minecraft:tall_grass'),
    (e.Target = 'minecraft:target'),
    (e.TintedGlass = 'minecraft:tinted_glass'),
    (e.Tnt = 'minecraft:tnt'),
    (e.Torch = 'minecraft:torch'),
    (e.Torchflower = 'minecraft:torchflower'),
    (e.TorchflowerCrop = 'minecraft:torchflower_crop'),
    (e.Trapdoor = 'minecraft:trapdoor'),
    (e.TrappedChest = 'minecraft:trapped_chest'),
    (e.TrialSpawner = 'minecraft:trial_spawner'),
    (e.TripWire = 'minecraft:trip_wire'),
    (e.TripwireHook = 'minecraft:tripwire_hook'),
    (e.TubeCoral = 'minecraft:tube_coral'),
    (e.TubeCoralBlock = 'minecraft:tube_coral_block'),
    (e.TubeCoralFan = 'minecraft:tube_coral_fan'),
    (e.TubeCoralWallFan = 'minecraft:tube_coral_wall_fan'),
    (e.Tuff = 'minecraft:tuff'),
    (e.TuffBrickDoubleSlab = 'minecraft:tuff_brick_double_slab'),
    (e.TuffBrickSlab = 'minecraft:tuff_brick_slab'),
    (e.TuffBrickStairs = 'minecraft:tuff_brick_stairs'),
    (e.TuffBrickWall = 'minecraft:tuff_brick_wall'),
    (e.TuffBricks = 'minecraft:tuff_bricks'),
    (e.TuffDoubleSlab = 'minecraft:tuff_double_slab'),
    (e.TuffSlab = 'minecraft:tuff_slab'),
    (e.TuffStairs = 'minecraft:tuff_stairs'),
    (e.TuffWall = 'minecraft:tuff_wall'),
    (e.TurtleEgg = 'minecraft:turtle_egg'),
    (e.TwistingVines = 'minecraft:twisting_vines'),
    (e.UnderwaterTnt = 'minecraft:underwater_tnt'),
    (e.UnderwaterTorch = 'minecraft:underwater_torch'),
    (e.UndyedShulkerBox = 'minecraft:undyed_shulker_box'),
    (e.Unknown = 'minecraft:unknown'),
    (e.UnlitRedstoneTorch = 'minecraft:unlit_redstone_torch'),
    (e.UnpoweredComparator = 'minecraft:unpowered_comparator'),
    (e.UnpoweredRepeater = 'minecraft:unpowered_repeater'),
    (e.Vault = 'minecraft:vault'),
    (e.VerdantFroglight = 'minecraft:verdant_froglight'),
    (e.Vine = 'minecraft:vine'),
    (e.WallBanner = 'minecraft:wall_banner'),
    (e.WallSign = 'minecraft:wall_sign'),
    (e.WarpedButton = 'minecraft:warped_button'),
    (e.WarpedDoor = 'minecraft:warped_door'),
    (e.WarpedDoubleSlab = 'minecraft:warped_double_slab'),
    (e.WarpedFence = 'minecraft:warped_fence'),
    (e.WarpedFenceGate = 'minecraft:warped_fence_gate'),
    (e.WarpedFungus = 'minecraft:warped_fungus'),
    (e.WarpedHangingSign = 'minecraft:warped_hanging_sign'),
    (e.WarpedHyphae = 'minecraft:warped_hyphae'),
    (e.WarpedNylium = 'minecraft:warped_nylium'),
    (e.WarpedPlanks = 'minecraft:warped_planks'),
    (e.WarpedPressurePlate = 'minecraft:warped_pressure_plate'),
    (e.WarpedRoots = 'minecraft:warped_roots'),
    (e.WarpedShelf = 'minecraft:warped_shelf'),
    (e.WarpedSlab = 'minecraft:warped_slab'),
    (e.WarpedStairs = 'minecraft:warped_stairs'),
    (e.WarpedStandingSign = 'minecraft:warped_standing_sign'),
    (e.WarpedStem = 'minecraft:warped_stem'),
    (e.WarpedTrapdoor = 'minecraft:warped_trapdoor'),
    (e.WarpedWallSign = 'minecraft:warped_wall_sign'),
    (e.WarpedWartBlock = 'minecraft:warped_wart_block'),
    (e.Water = 'minecraft:water'),
    (e.Waterlily = 'minecraft:waterlily'),
    (e.WaxedChiseledCopper = 'minecraft:waxed_chiseled_copper'),
    (e.WaxedCopper = 'minecraft:waxed_copper'),
    (e.WaxedCopperBars = 'minecraft:waxed_copper_bars'),
    (e.WaxedCopperBulb = 'minecraft:waxed_copper_bulb'),
    (e.WaxedCopperChain = 'minecraft:waxed_copper_chain'),
    (e.WaxedCopperChest = 'minecraft:waxed_copper_chest'),
    (e.WaxedCopperDoor = 'minecraft:waxed_copper_door'),
    (e.WaxedCopperGolemStatue = 'minecraft:waxed_copper_golem_statue'),
    (e.WaxedCopperGrate = 'minecraft:waxed_copper_grate'),
    (e.WaxedCopperLantern = 'minecraft:waxed_copper_lantern'),
    (e.WaxedCopperTrapdoor = 'minecraft:waxed_copper_trapdoor'),
    (e.WaxedCutCopper = 'minecraft:waxed_cut_copper'),
    (e.WaxedCutCopperSlab = 'minecraft:waxed_cut_copper_slab'),
    (e.WaxedCutCopperStairs = 'minecraft:waxed_cut_copper_stairs'),
    (e.WaxedDoubleCutCopperSlab = 'minecraft:waxed_double_cut_copper_slab'),
    (e.WaxedExposedChiseledCopper = 'minecraft:waxed_exposed_chiseled_copper'),
    (e.WaxedExposedCopper = 'minecraft:waxed_exposed_copper'),
    (e.WaxedExposedCopperBars = 'minecraft:waxed_exposed_copper_bars'),
    (e.WaxedExposedCopperBulb = 'minecraft:waxed_exposed_copper_bulb'),
    (e.WaxedExposedCopperChain = 'minecraft:waxed_exposed_copper_chain'),
    (e.WaxedExposedCopperChest = 'minecraft:waxed_exposed_copper_chest'),
    (e.WaxedExposedCopperDoor = 'minecraft:waxed_exposed_copper_door'),
    (e.WaxedExposedCopperGolemStatue = 'minecraft:waxed_exposed_copper_golem_statue'),
    (e.WaxedExposedCopperGrate = 'minecraft:waxed_exposed_copper_grate'),
    (e.WaxedExposedCopperLantern = 'minecraft:waxed_exposed_copper_lantern'),
    (e.WaxedExposedCopperTrapdoor = 'minecraft:waxed_exposed_copper_trapdoor'),
    (e.WaxedExposedCutCopper = 'minecraft:waxed_exposed_cut_copper'),
    (e.WaxedExposedCutCopperSlab = 'minecraft:waxed_exposed_cut_copper_slab'),
    (e.WaxedExposedCutCopperStairs = 'minecraft:waxed_exposed_cut_copper_stairs'),
    (e.WaxedExposedDoubleCutCopperSlab = 'minecraft:waxed_exposed_double_cut_copper_slab'),
    (e.WaxedExposedLightningRod = 'minecraft:waxed_exposed_lightning_rod'),
    (e.WaxedLightningRod = 'minecraft:waxed_lightning_rod'),
    (e.WaxedOxidizedChiseledCopper = 'minecraft:waxed_oxidized_chiseled_copper'),
    (e.WaxedOxidizedCopper = 'minecraft:waxed_oxidized_copper'),
    (e.WaxedOxidizedCopperBars = 'minecraft:waxed_oxidized_copper_bars'),
    (e.WaxedOxidizedCopperBulb = 'minecraft:waxed_oxidized_copper_bulb'),
    (e.WaxedOxidizedCopperChain = 'minecraft:waxed_oxidized_copper_chain'),
    (e.WaxedOxidizedCopperChest = 'minecraft:waxed_oxidized_copper_chest'),
    (e.WaxedOxidizedCopperDoor = 'minecraft:waxed_oxidized_copper_door'),
    (e.WaxedOxidizedCopperGolemStatue = 'minecraft:waxed_oxidized_copper_golem_statue'),
    (e.WaxedOxidizedCopperGrate = 'minecraft:waxed_oxidized_copper_grate'),
    (e.WaxedOxidizedCopperLantern = 'minecraft:waxed_oxidized_copper_lantern'),
    (e.WaxedOxidizedCopperTrapdoor = 'minecraft:waxed_oxidized_copper_trapdoor'),
    (e.WaxedOxidizedCutCopper = 'minecraft:waxed_oxidized_cut_copper'),
    (e.WaxedOxidizedCutCopperSlab = 'minecraft:waxed_oxidized_cut_copper_slab'),
    (e.WaxedOxidizedCutCopperStairs = 'minecraft:waxed_oxidized_cut_copper_stairs'),
    (e.WaxedOxidizedDoubleCutCopperSlab = 'minecraft:waxed_oxidized_double_cut_copper_slab'),
    (e.WaxedOxidizedLightningRod = 'minecraft:waxed_oxidized_lightning_rod'),
    (e.WaxedWeatheredChiseledCopper = 'minecraft:waxed_weathered_chiseled_copper'),
    (e.WaxedWeatheredCopper = 'minecraft:waxed_weathered_copper'),
    (e.WaxedWeatheredCopperBars = 'minecraft:waxed_weathered_copper_bars'),
    (e.WaxedWeatheredCopperBulb = 'minecraft:waxed_weathered_copper_bulb'),
    (e.WaxedWeatheredCopperChain = 'minecraft:waxed_weathered_copper_chain'),
    (e.WaxedWeatheredCopperChest = 'minecraft:waxed_weathered_copper_chest'),
    (e.WaxedWeatheredCopperDoor = 'minecraft:waxed_weathered_copper_door'),
    (e.WaxedWeatheredCopperGolemStatue = 'minecraft:waxed_weathered_copper_golem_statue'),
    (e.WaxedWeatheredCopperGrate = 'minecraft:waxed_weathered_copper_grate'),
    (e.WaxedWeatheredCopperLantern = 'minecraft:waxed_weathered_copper_lantern'),
    (e.WaxedWeatheredCopperTrapdoor = 'minecraft:waxed_weathered_copper_trapdoor'),
    (e.WaxedWeatheredCutCopper = 'minecraft:waxed_weathered_cut_copper'),
    (e.WaxedWeatheredCutCopperSlab = 'minecraft:waxed_weathered_cut_copper_slab'),
    (e.WaxedWeatheredCutCopperStairs = 'minecraft:waxed_weathered_cut_copper_stairs'),
    (e.WaxedWeatheredDoubleCutCopperSlab = 'minecraft:waxed_weathered_double_cut_copper_slab'),
    (e.WaxedWeatheredLightningRod = 'minecraft:waxed_weathered_lightning_rod'),
    (e.WeatheredChiseledCopper = 'minecraft:weathered_chiseled_copper'),
    (e.WeatheredCopper = 'minecraft:weathered_copper'),
    (e.WeatheredCopperBars = 'minecraft:weathered_copper_bars'),
    (e.WeatheredCopperBulb = 'minecraft:weathered_copper_bulb'),
    (e.WeatheredCopperChain = 'minecraft:weathered_copper_chain'),
    (e.WeatheredCopperChest = 'minecraft:weathered_copper_chest'),
    (e.WeatheredCopperDoor = 'minecraft:weathered_copper_door'),
    (e.WeatheredCopperGolemStatue = 'minecraft:weathered_copper_golem_statue'),
    (e.WeatheredCopperGrate = 'minecraft:weathered_copper_grate'),
    (e.WeatheredCopperLantern = 'minecraft:weathered_copper_lantern'),
    (e.WeatheredCopperTrapdoor = 'minecraft:weathered_copper_trapdoor'),
    (e.WeatheredCutCopper = 'minecraft:weathered_cut_copper'),
    (e.WeatheredCutCopperSlab = 'minecraft:weathered_cut_copper_slab'),
    (e.WeatheredCutCopperStairs = 'minecraft:weathered_cut_copper_stairs'),
    (e.WeatheredDoubleCutCopperSlab = 'minecraft:weathered_double_cut_copper_slab'),
    (e.WeatheredLightningRod = 'minecraft:weathered_lightning_rod'),
    (e.Web = 'minecraft:web'),
    (e.WeepingVines = 'minecraft:weeping_vines'),
    (e.WetSponge = 'minecraft:wet_sponge'),
    (e.Wheat = 'minecraft:wheat'),
    (e.WhiteCandle = 'minecraft:white_candle'),
    (e.WhiteCandleCake = 'minecraft:white_candle_cake'),
    (e.WhiteCarpet = 'minecraft:white_carpet'),
    (e.WhiteConcrete = 'minecraft:white_concrete'),
    (e.WhiteConcretePowder = 'minecraft:white_concrete_powder'),
    (e.WhiteGlazedTerracotta = 'minecraft:white_glazed_terracotta'),
    (e.WhiteShulkerBox = 'minecraft:white_shulker_box'),
    (e.WhiteStainedGlass = 'minecraft:white_stained_glass'),
    (e.WhiteStainedGlassPane = 'minecraft:white_stained_glass_pane'),
    (e.WhiteTerracotta = 'minecraft:white_terracotta'),
    (e.WhiteTulip = 'minecraft:white_tulip'),
    (e.WhiteWool = 'minecraft:white_wool'),
    (e.Wildflowers = 'minecraft:wildflowers'),
    (e.WitherRose = 'minecraft:wither_rose'),
    (e.WitherSkeletonSkull = 'minecraft:wither_skeleton_skull'),
    (e.WoodenButton = 'minecraft:wooden_button'),
    (e.WoodenDoor = 'minecraft:wooden_door'),
    (e.WoodenPressurePlate = 'minecraft:wooden_pressure_plate'),
    (e.YellowCandle = 'minecraft:yellow_candle'),
    (e.YellowCandleCake = 'minecraft:yellow_candle_cake'),
    (e.YellowCarpet = 'minecraft:yellow_carpet'),
    (e.YellowConcrete = 'minecraft:yellow_concrete'),
    (e.YellowConcretePowder = 'minecraft:yellow_concrete_powder'),
    (e.YellowGlazedTerracotta = 'minecraft:yellow_glazed_terracotta'),
    (e.YellowShulkerBox = 'minecraft:yellow_shulker_box'),
    (e.YellowStainedGlass = 'minecraft:yellow_stained_glass'),
    (e.YellowStainedGlassPane = 'minecraft:yellow_stained_glass_pane'),
    (e.YellowTerracotta = 'minecraft:yellow_terracotta'),
    (e.YellowWool = 'minecraft:yellow_wool'),
    (e.ZombieHead = 'minecraft:zombie_head'),
    e
  ))(te || {}),
  Su = ((e) => (
    (e.ControlSchemeCamera = 'minecraft:control_scheme_camera'),
    (e.FirstPerson = 'minecraft:first_person'),
    (e.FixedBoom = 'minecraft:fixed_boom'),
    (e.FollowOrbit = 'minecraft:follow_orbit'),
    (e.Free = 'minecraft:free'),
    (e.ThirdPerson = 'minecraft:third_person'),
    (e.ThirdPersonFront = 'minecraft:third_person_front'),
    e
  ))(Su || {}),
  Cu = ((e) => (
    (e.Chorusfruit = 'minecraft:chorusfruit'),
    (e.EnderPearl = 'minecraft:ender_pearl'),
    (e.GoatHorn = 'minecraft:goat_horn'),
    (e.Shield = 'minecraft:shield'),
    (e.Spear = 'minecraft:spear'),
    (e.WindCharge = 'minecraft:wind_charge'),
    e
  ))(Cu || {}),
  zn = ((e) => (
    (e.Nether = 'minecraft:nether'),
    (e.Overworld = 'minecraft:overworld'),
    (e.TheEnd = 'minecraft:the_end'),
    e
  ))(zn || {}),
  Pt = ((e) => (
    (e.Absorption = 'minecraft:absorption'),
    (e.BadOmen = 'minecraft:bad_omen'),
    (e.Blindness = 'minecraft:blindness'),
    (e.BreathOfTheNautilus = 'minecraft:breath_of_the_nautilus'),
    (e.ConduitPower = 'minecraft:conduit_power'),
    (e.Darkness = 'minecraft:darkness'),
    (e.FatalPoison = 'minecraft:fatal_poison'),
    (e.FireResistance = 'minecraft:fire_resistance'),
    (e.Haste = 'minecraft:haste'),
    (e.HealthBoost = 'minecraft:health_boost'),
    (e.Hunger = 'minecraft:hunger'),
    (e.Infested = 'minecraft:infested'),
    (e.InstantDamage = 'minecraft:instant_damage'),
    (e.InstantHealth = 'minecraft:instant_health'),
    (e.Invisibility = 'minecraft:invisibility'),
    (e.JumpBoost = 'minecraft:jump_boost'),
    (e.Levitation = 'minecraft:levitation'),
    (e.MiningFatigue = 'minecraft:mining_fatigue'),
    (e.Nausea = 'minecraft:nausea'),
    (e.NightVision = 'minecraft:night_vision'),
    (e.Oozing = 'minecraft:oozing'),
    (e.Poison = 'minecraft:poison'),
    (e.RaidOmen = 'minecraft:raid_omen'),
    (e.Regeneration = 'minecraft:regeneration'),
    (e.Resistance = 'minecraft:resistance'),
    (e.Saturation = 'minecraft:saturation'),
    (e.SlowFalling = 'minecraft:slow_falling'),
    (e.Slowness = 'minecraft:slowness'),
    (e.Speed = 'minecraft:speed'),
    (e.Strength = 'minecraft:strength'),
    (e.TrialOmen = 'minecraft:trial_omen'),
    (e.VillageHero = 'minecraft:village_hero'),
    (e.WaterBreathing = 'minecraft:water_breathing'),
    (e.Weakness = 'minecraft:weakness'),
    (e.Weaving = 'minecraft:weaving'),
    (e.WindCharged = 'minecraft:wind_charged'),
    (e.Wither = 'minecraft:wither'),
    e
  ))(Pt || {}),
  Dr = ((e) => (
    (e.AquaAffinity = 'minecraft:aqua_affinity'),
    (e.BaneOfArthropods = 'minecraft:bane_of_arthropods'),
    (e.Binding = 'minecraft:binding'),
    (e.BlastProtection = 'minecraft:blast_protection'),
    (e.BowInfinity = 'minecraft:infinity'),
    (e.Breach = 'minecraft:breach'),
    (e.Channeling = 'minecraft:channeling'),
    (e.Density = 'minecraft:density'),
    (e.DepthStrider = 'minecraft:depth_strider'),
    (e.Efficiency = 'minecraft:efficiency'),
    (e.FeatherFalling = 'minecraft:feather_falling'),
    (e.FireAspect = 'minecraft:fire_aspect'),
    (e.FireProtection = 'minecraft:fire_protection'),
    (e.Flame = 'minecraft:flame'),
    (e.Fortune = 'minecraft:fortune'),
    (e.FrostWalker = 'minecraft:frost_walker'),
    (e.Impaling = 'minecraft:impaling'),
    (e.Knockback = 'minecraft:knockback'),
    (e.Looting = 'minecraft:looting'),
    (e.Loyalty = 'minecraft:loyalty'),
    (e.LuckOfTheSea = 'minecraft:luck_of_the_sea'),
    (e.Lunge = 'minecraft:lunge'),
    (e.Lure = 'minecraft:lure'),
    (e.Mending = 'minecraft:mending'),
    (e.Multishot = 'minecraft:multishot'),
    (e.Piercing = 'minecraft:piercing'),
    (e.Power = 'minecraft:power'),
    (e.ProjectileProtection = 'minecraft:projectile_protection'),
    (e.Protection = 'minecraft:protection'),
    (e.Punch = 'minecraft:punch'),
    (e.QuickCharge = 'minecraft:quick_charge'),
    (e.Respiration = 'minecraft:respiration'),
    (e.Riptide = 'minecraft:riptide'),
    (e.Sharpness = 'minecraft:sharpness'),
    (e.SilkTouch = 'minecraft:silk_touch'),
    (e.Smite = 'minecraft:smite'),
    (e.SoulSpeed = 'minecraft:soul_speed'),
    (e.SwiftSneak = 'minecraft:swift_sneak'),
    (e.Thorns = 'minecraft:thorns'),
    (e.Unbreaking = 'minecraft:unbreaking'),
    (e.Vanishing = 'minecraft:vanishing'),
    (e.WindBurst = 'minecraft:wind_burst'),
    e
  ))(Dr || {}),
  It = ((e) => (
    (e.Agent = 'minecraft:agent'),
    (e.Allay = 'minecraft:allay'),
    (e.AreaEffectCloud = 'minecraft:area_effect_cloud'),
    (e.Armadillo = 'minecraft:armadillo'),
    (e.ArmorStand = 'minecraft:armor_stand'),
    (e.Arrow = 'minecraft:arrow'),
    (e.Axolotl = 'minecraft:axolotl'),
    (e.Bat = 'minecraft:bat'),
    (e.Bee = 'minecraft:bee'),
    (e.Blaze = 'minecraft:blaze'),
    (e.Boat = 'minecraft:boat'),
    (e.Bogged = 'minecraft:bogged'),
    (e.Breeze = 'minecraft:breeze'),
    (e.BreezeWindChargeProjectile = 'minecraft:breeze_wind_charge_projectile'),
    (e.Camel = 'minecraft:camel'),
    (e.CamelHusk = 'minecraft:camel_husk'),
    (e.Cat = 'minecraft:cat'),
    (e.CaveSpider = 'minecraft:cave_spider'),
    (e.ChestBoat = 'minecraft:chest_boat'),
    (e.ChestMinecart = 'minecraft:chest_minecart'),
    (e.Chicken = 'minecraft:chicken'),
    (e.Cod = 'minecraft:cod'),
    (e.CommandBlockMinecart = 'minecraft:command_block_minecart'),
    (e.CopperGolem = 'minecraft:copper_golem'),
    (e.Cow = 'minecraft:cow'),
    (e.Creaking = 'minecraft:creaking'),
    (e.Creeper = 'minecraft:creeper'),
    (e.Dolphin = 'minecraft:dolphin'),
    (e.Donkey = 'minecraft:donkey'),
    (e.DragonFireball = 'minecraft:dragon_fireball'),
    (e.Drowned = 'minecraft:drowned'),
    (e.Egg = 'minecraft:egg'),
    (e.ElderGuardian = 'minecraft:elder_guardian'),
    (e.EnderCrystal = 'minecraft:ender_crystal'),
    (e.EnderDragon = 'minecraft:ender_dragon'),
    (e.EnderPearl = 'minecraft:ender_pearl'),
    (e.Enderman = 'minecraft:enderman'),
    (e.Endermite = 'minecraft:endermite'),
    (e.EvocationIllager = 'minecraft:evocation_illager'),
    (e.EyeOfEnderSignal = 'minecraft:eye_of_ender_signal'),
    (e.Fireball = 'minecraft:fireball'),
    (e.FireworksRocket = 'minecraft:fireworks_rocket'),
    (e.FishingHook = 'minecraft:fishing_hook'),
    (e.Fox = 'minecraft:fox'),
    (e.Frog = 'minecraft:frog'),
    (e.Ghast = 'minecraft:ghast'),
    (e.GlowSquid = 'minecraft:glow_squid'),
    (e.Goat = 'minecraft:goat'),
    (e.Guardian = 'minecraft:guardian'),
    (e.HappyGhast = 'minecraft:happy_ghast'),
    (e.Hoglin = 'minecraft:hoglin'),
    (e.HopperMinecart = 'minecraft:hopper_minecart'),
    (e.Horse = 'minecraft:horse'),
    (e.Husk = 'minecraft:husk'),
    (e.IronGolem = 'minecraft:iron_golem'),
    (e.LightningBolt = 'minecraft:lightning_bolt'),
    (e.LingeringPotion = 'minecraft:lingering_potion'),
    (e.Llama = 'minecraft:llama'),
    (e.LlamaSpit = 'minecraft:llama_spit'),
    (e.MagmaCube = 'minecraft:magma_cube'),
    (e.Minecart = 'minecraft:minecart'),
    (e.Mooshroom = 'minecraft:mooshroom'),
    (e.Mule = 'minecraft:mule'),
    (e.Nautilus = 'minecraft:nautilus'),
    (e.Npc = 'minecraft:npc'),
    (e.Ocelot = 'minecraft:ocelot'),
    (e.OminousItemSpawner = 'minecraft:ominous_item_spawner'),
    (e.Panda = 'minecraft:panda'),
    (e.Parched = 'minecraft:parched'),
    (e.Parrot = 'minecraft:parrot'),
    (e.Phantom = 'minecraft:phantom'),
    (e.Pig = 'minecraft:pig'),
    (e.Piglin = 'minecraft:piglin'),
    (e.PiglinBrute = 'minecraft:piglin_brute'),
    (e.Pillager = 'minecraft:pillager'),
    (e.Player = 'minecraft:player'),
    (e.PolarBear = 'minecraft:polar_bear'),
    (e.Pufferfish = 'minecraft:pufferfish'),
    (e.Rabbit = 'minecraft:rabbit'),
    (e.Ravager = 'minecraft:ravager'),
    (e.Salmon = 'minecraft:salmon'),
    (e.Sheep = 'minecraft:sheep'),
    (e.Shulker = 'minecraft:shulker'),
    (e.ShulkerBullet = 'minecraft:shulker_bullet'),
    (e.Silverfish = 'minecraft:silverfish'),
    (e.Skeleton = 'minecraft:skeleton'),
    (e.SkeletonHorse = 'minecraft:skeleton_horse'),
    (e.Slime = 'minecraft:slime'),
    (e.SmallFireball = 'minecraft:small_fireball'),
    (e.Sniffer = 'minecraft:sniffer'),
    (e.SnowGolem = 'minecraft:snow_golem'),
    (e.Snowball = 'minecraft:snowball'),
    (e.Spider = 'minecraft:spider'),
    (e.SplashPotion = 'minecraft:splash_potion'),
    (e.Squid = 'minecraft:squid'),
    (e.Stray = 'minecraft:stray'),
    (e.Strider = 'minecraft:strider'),
    (e.Tadpole = 'minecraft:tadpole'),
    (e.ThrownTrident = 'minecraft:thrown_trident'),
    (e.Tnt = 'minecraft:tnt'),
    (e.TntMinecart = 'minecraft:tnt_minecart'),
    (e.TraderLlama = 'minecraft:trader_llama'),
    (e.TripodCamera = 'minecraft:tripod_camera'),
    (e.Tropicalfish = 'minecraft:tropicalfish'),
    (e.Turtle = 'minecraft:turtle'),
    (e.Vex = 'minecraft:vex'),
    (e.Villager = 'minecraft:villager'),
    (e.VillagerV2 = 'minecraft:villager_v2'),
    (e.Vindicator = 'minecraft:vindicator'),
    (e.WanderingTrader = 'minecraft:wandering_trader'),
    (e.Warden = 'minecraft:warden'),
    (e.WindChargeProjectile = 'minecraft:wind_charge_projectile'),
    (e.Witch = 'minecraft:witch'),
    (e.Wither = 'minecraft:wither'),
    (e.WitherSkeleton = 'minecraft:wither_skeleton'),
    (e.WitherSkull = 'minecraft:wither_skull'),
    (e.WitherSkullDangerous = 'minecraft:wither_skull_dangerous'),
    (e.Wolf = 'minecraft:wolf'),
    (e.XpBottle = 'minecraft:xp_bottle'),
    (e.XpOrb = 'minecraft:xp_orb'),
    (e.Zoglin = 'minecraft:zoglin'),
    (e.Zombie = 'minecraft:zombie'),
    (e.ZombieHorse = 'minecraft:zombie_horse'),
    (e.ZombieNautilus = 'minecraft:zombie_nautilus'),
    (e.ZombiePigman = 'minecraft:zombie_pigman'),
    (e.ZombieVillager = 'minecraft:zombie_villager'),
    (e.ZombieVillagerV2 = 'minecraft:zombie_villager_v2'),
    e
  ))(It || {}),
  yu = ((e) => (
    (e.AncientCity = 'minecraft:ancient_city'),
    (e.BastionRemnant = 'minecraft:bastion_remnant'),
    (e.BuriedTreasure = 'minecraft:buried_treasure'),
    (e.EndCity = 'minecraft:end_city'),
    (e.Fortress = 'minecraft:fortress'),
    (e.Mansion = 'minecraft:mansion'),
    (e.Mineshaft = 'minecraft:mineshaft'),
    (e.Monument = 'minecraft:monument'),
    (e.PillagerOutpost = 'minecraft:pillager_outpost'),
    (e.RuinedPortal = 'minecraft:ruined_portal'),
    (e.Ruins = 'minecraft:ruins'),
    (e.Shipwreck = 'minecraft:shipwreck'),
    (e.Stronghold = 'minecraft:stronghold'),
    (e.Temple = 'minecraft:temple'),
    (e.TrailRuins = 'minecraft:trail_ruins'),
    (e.TrialChambers = 'minecraft:trial_chambers'),
    (e.Village = 'minecraft:village'),
    e
  ))(yu || {}),
  E = ((e) => (
    (e.AcaciaBoat = 'minecraft:acacia_boat'),
    (e.AcaciaButton = 'minecraft:acacia_button'),
    (e.AcaciaChestBoat = 'minecraft:acacia_chest_boat'),
    (e.AcaciaDoor = 'minecraft:acacia_door'),
    (e.AcaciaFence = 'minecraft:acacia_fence'),
    (e.AcaciaFenceGate = 'minecraft:acacia_fence_gate'),
    (e.AcaciaHangingSign = 'minecraft:acacia_hanging_sign'),
    (e.AcaciaLeaves = 'minecraft:acacia_leaves'),
    (e.AcaciaLog = 'minecraft:acacia_log'),
    (e.AcaciaPlanks = 'minecraft:acacia_planks'),
    (e.AcaciaPressurePlate = 'minecraft:acacia_pressure_plate'),
    (e.AcaciaSapling = 'minecraft:acacia_sapling'),
    (e.AcaciaShelf = 'minecraft:acacia_shelf'),
    (e.AcaciaSign = 'minecraft:acacia_sign'),
    (e.AcaciaSlab = 'minecraft:acacia_slab'),
    (e.AcaciaStairs = 'minecraft:acacia_stairs'),
    (e.AcaciaTrapdoor = 'minecraft:acacia_trapdoor'),
    (e.AcaciaWood = 'minecraft:acacia_wood'),
    (e.ActivatorRail = 'minecraft:activator_rail'),
    (e.AllaySpawnEgg = 'minecraft:allay_spawn_egg'),
    (e.Allium = 'minecraft:allium'),
    (e.Allow = 'minecraft:allow'),
    (e.AmethystBlock = 'minecraft:amethyst_block'),
    (e.AmethystCluster = 'minecraft:amethyst_cluster'),
    (e.AmethystShard = 'minecraft:amethyst_shard'),
    (e.AncientDebris = 'minecraft:ancient_debris'),
    (e.Andesite = 'minecraft:andesite'),
    (e.AndesiteSlab = 'minecraft:andesite_slab'),
    (e.AndesiteStairs = 'minecraft:andesite_stairs'),
    (e.AndesiteWall = 'minecraft:andesite_wall'),
    (e.AnglerPotterySherd = 'minecraft:angler_pottery_sherd'),
    (e.Anvil = 'minecraft:anvil'),
    (e.Apple = 'minecraft:apple'),
    (e.ArcherPotterySherd = 'minecraft:archer_pottery_sherd'),
    (e.ArmadilloScute = 'minecraft:armadillo_scute'),
    (e.ArmadilloSpawnEgg = 'minecraft:armadillo_spawn_egg'),
    (e.ArmorStand = 'minecraft:armor_stand'),
    (e.ArmsUpPotterySherd = 'minecraft:arms_up_pottery_sherd'),
    (e.Arrow = 'minecraft:arrow'),
    (e.AxolotlBucket = 'minecraft:axolotl_bucket'),
    (e.AxolotlSpawnEgg = 'minecraft:axolotl_spawn_egg'),
    (e.Azalea = 'minecraft:azalea'),
    (e.AzaleaLeaves = 'minecraft:azalea_leaves'),
    (e.AzaleaLeavesFlowered = 'minecraft:azalea_leaves_flowered'),
    (e.AzureBluet = 'minecraft:azure_bluet'),
    (e.BakedPotato = 'minecraft:baked_potato'),
    (e.Bamboo = 'minecraft:bamboo'),
    (e.BambooBlock = 'minecraft:bamboo_block'),
    (e.BambooButton = 'minecraft:bamboo_button'),
    (e.BambooChestRaft = 'minecraft:bamboo_chest_raft'),
    (e.BambooDoor = 'minecraft:bamboo_door'),
    (e.BambooFence = 'minecraft:bamboo_fence'),
    (e.BambooFenceGate = 'minecraft:bamboo_fence_gate'),
    (e.BambooHangingSign = 'minecraft:bamboo_hanging_sign'),
    (e.BambooMosaic = 'minecraft:bamboo_mosaic'),
    (e.BambooMosaicSlab = 'minecraft:bamboo_mosaic_slab'),
    (e.BambooMosaicStairs = 'minecraft:bamboo_mosaic_stairs'),
    (e.BambooPlanks = 'minecraft:bamboo_planks'),
    (e.BambooPressurePlate = 'minecraft:bamboo_pressure_plate'),
    (e.BambooRaft = 'minecraft:bamboo_raft'),
    (e.BambooShelf = 'minecraft:bamboo_shelf'),
    (e.BambooSign = 'minecraft:bamboo_sign'),
    (e.BambooSlab = 'minecraft:bamboo_slab'),
    (e.BambooStairs = 'minecraft:bamboo_stairs'),
    (e.BambooTrapdoor = 'minecraft:bamboo_trapdoor'),
    (e.Banner = 'minecraft:banner'),
    (e.Barrel = 'minecraft:barrel'),
    (e.Barrier = 'minecraft:barrier'),
    (e.Basalt = 'minecraft:basalt'),
    (e.BatSpawnEgg = 'minecraft:bat_spawn_egg'),
    (e.Beacon = 'minecraft:beacon'),
    (e.Bed = 'minecraft:bed'),
    (e.Bedrock = 'minecraft:bedrock'),
    (e.BeeNest = 'minecraft:bee_nest'),
    (e.BeeSpawnEgg = 'minecraft:bee_spawn_egg'),
    (e.Beef = 'minecraft:beef'),
    (e.Beehive = 'minecraft:beehive'),
    (e.Beetroot = 'minecraft:beetroot'),
    (e.BeetrootSeeds = 'minecraft:beetroot_seeds'),
    (e.BeetrootSoup = 'minecraft:beetroot_soup'),
    (e.Bell = 'minecraft:bell'),
    (e.BigDripleaf = 'minecraft:big_dripleaf'),
    (e.BirchBoat = 'minecraft:birch_boat'),
    (e.BirchButton = 'minecraft:birch_button'),
    (e.BirchChestBoat = 'minecraft:birch_chest_boat'),
    (e.BirchDoor = 'minecraft:birch_door'),
    (e.BirchFence = 'minecraft:birch_fence'),
    (e.BirchFenceGate = 'minecraft:birch_fence_gate'),
    (e.BirchHangingSign = 'minecraft:birch_hanging_sign'),
    (e.BirchLeaves = 'minecraft:birch_leaves'),
    (e.BirchLog = 'minecraft:birch_log'),
    (e.BirchPlanks = 'minecraft:birch_planks'),
    (e.BirchPressurePlate = 'minecraft:birch_pressure_plate'),
    (e.BirchSapling = 'minecraft:birch_sapling'),
    (e.BirchShelf = 'minecraft:birch_shelf'),
    (e.BirchSign = 'minecraft:birch_sign'),
    (e.BirchSlab = 'minecraft:birch_slab'),
    (e.BirchStairs = 'minecraft:birch_stairs'),
    (e.BirchTrapdoor = 'minecraft:birch_trapdoor'),
    (e.BirchWood = 'minecraft:birch_wood'),
    (e.BlackBundle = 'minecraft:black_bundle'),
    (e.BlackCandle = 'minecraft:black_candle'),
    (e.BlackCarpet = 'minecraft:black_carpet'),
    (e.BlackConcrete = 'minecraft:black_concrete'),
    (e.BlackConcretePowder = 'minecraft:black_concrete_powder'),
    (e.BlackDye = 'minecraft:black_dye'),
    (e.BlackGlazedTerracotta = 'minecraft:black_glazed_terracotta'),
    (e.BlackHarness = 'minecraft:black_harness'),
    (e.BlackShulkerBox = 'minecraft:black_shulker_box'),
    (e.BlackStainedGlass = 'minecraft:black_stained_glass'),
    (e.BlackStainedGlassPane = 'minecraft:black_stained_glass_pane'),
    (e.BlackTerracotta = 'minecraft:black_terracotta'),
    (e.BlackWool = 'minecraft:black_wool'),
    (e.Blackstone = 'minecraft:blackstone'),
    (e.BlackstoneSlab = 'minecraft:blackstone_slab'),
    (e.BlackstoneStairs = 'minecraft:blackstone_stairs'),
    (e.BlackstoneWall = 'minecraft:blackstone_wall'),
    (e.BladePotterySherd = 'minecraft:blade_pottery_sherd'),
    (e.BlastFurnace = 'minecraft:blast_furnace'),
    (e.BlazePowder = 'minecraft:blaze_powder'),
    (e.BlazeRod = 'minecraft:blaze_rod'),
    (e.BlazeSpawnEgg = 'minecraft:blaze_spawn_egg'),
    (e.BlueBundle = 'minecraft:blue_bundle'),
    (e.BlueCandle = 'minecraft:blue_candle'),
    (e.BlueCarpet = 'minecraft:blue_carpet'),
    (e.BlueConcrete = 'minecraft:blue_concrete'),
    (e.BlueConcretePowder = 'minecraft:blue_concrete_powder'),
    (e.BlueDye = 'minecraft:blue_dye'),
    (e.BlueEgg = 'minecraft:blue_egg'),
    (e.BlueGlazedTerracotta = 'minecraft:blue_glazed_terracotta'),
    (e.BlueHarness = 'minecraft:blue_harness'),
    (e.BlueIce = 'minecraft:blue_ice'),
    (e.BlueOrchid = 'minecraft:blue_orchid'),
    (e.BlueShulkerBox = 'minecraft:blue_shulker_box'),
    (e.BlueStainedGlass = 'minecraft:blue_stained_glass'),
    (e.BlueStainedGlassPane = 'minecraft:blue_stained_glass_pane'),
    (e.BlueTerracotta = 'minecraft:blue_terracotta'),
    (e.BlueWool = 'minecraft:blue_wool'),
    (e.BoggedSpawnEgg = 'minecraft:bogged_spawn_egg'),
    (e.BoltArmorTrimSmithingTemplate = 'minecraft:bolt_armor_trim_smithing_template'),
    (e.Bone = 'minecraft:bone'),
    (e.BoneBlock = 'minecraft:bone_block'),
    (e.BoneMeal = 'minecraft:bone_meal'),
    (e.Book = 'minecraft:book'),
    (e.Bookshelf = 'minecraft:bookshelf'),
    (e.BorderBlock = 'minecraft:border_block'),
    (e.BordureIndentedBannerPattern = 'minecraft:bordure_indented_banner_pattern'),
    (e.Bow = 'minecraft:bow'),
    (e.Bowl = 'minecraft:bowl'),
    (e.BrainCoral = 'minecraft:brain_coral'),
    (e.BrainCoralBlock = 'minecraft:brain_coral_block'),
    (e.BrainCoralFan = 'minecraft:brain_coral_fan'),
    (e.Bread = 'minecraft:bread'),
    (e.BreezeRod = 'minecraft:breeze_rod'),
    (e.BreezeSpawnEgg = 'minecraft:breeze_spawn_egg'),
    (e.BrewerPotterySherd = 'minecraft:brewer_pottery_sherd'),
    (e.BrewingStand = 'minecraft:brewing_stand'),
    (e.Brick = 'minecraft:brick'),
    (e.BrickBlock = 'minecraft:brick_block'),
    (e.BrickSlab = 'minecraft:brick_slab'),
    (e.BrickStairs = 'minecraft:brick_stairs'),
    (e.BrickWall = 'minecraft:brick_wall'),
    (e.BrownBundle = 'minecraft:brown_bundle'),
    (e.BrownCandle = 'minecraft:brown_candle'),
    (e.BrownCarpet = 'minecraft:brown_carpet'),
    (e.BrownConcrete = 'minecraft:brown_concrete'),
    (e.BrownConcretePowder = 'minecraft:brown_concrete_powder'),
    (e.BrownDye = 'minecraft:brown_dye'),
    (e.BrownEgg = 'minecraft:brown_egg'),
    (e.BrownGlazedTerracotta = 'minecraft:brown_glazed_terracotta'),
    (e.BrownHarness = 'minecraft:brown_harness'),
    (e.BrownMushroom = 'minecraft:brown_mushroom'),
    (e.BrownMushroomBlock = 'minecraft:brown_mushroom_block'),
    (e.BrownShulkerBox = 'minecraft:brown_shulker_box'),
    (e.BrownStainedGlass = 'minecraft:brown_stained_glass'),
    (e.BrownStainedGlassPane = 'minecraft:brown_stained_glass_pane'),
    (e.BrownTerracotta = 'minecraft:brown_terracotta'),
    (e.BrownWool = 'minecraft:brown_wool'),
    (e.Brush = 'minecraft:brush'),
    (e.BubbleCoral = 'minecraft:bubble_coral'),
    (e.BubbleCoralBlock = 'minecraft:bubble_coral_block'),
    (e.BubbleCoralFan = 'minecraft:bubble_coral_fan'),
    (e.Bucket = 'minecraft:bucket'),
    (e.BuddingAmethyst = 'minecraft:budding_amethyst'),
    (e.Bundle = 'minecraft:bundle'),
    (e.BurnPotterySherd = 'minecraft:burn_pottery_sherd'),
    (e.Bush = 'minecraft:bush'),
    (e.Cactus = 'minecraft:cactus'),
    (e.CactusFlower = 'minecraft:cactus_flower'),
    (e.Cake = 'minecraft:cake'),
    (e.Calcite = 'minecraft:calcite'),
    (e.CalibratedSculkSensor = 'minecraft:calibrated_sculk_sensor'),
    (e.CamelHuskSpawnEgg = 'minecraft:camel_husk_spawn_egg'),
    (e.CamelSpawnEgg = 'minecraft:camel_spawn_egg'),
    (e.Campfire = 'minecraft:campfire'),
    (e.Candle = 'minecraft:candle'),
    (e.Carrot = 'minecraft:carrot'),
    (e.CarrotOnAStick = 'minecraft:carrot_on_a_stick'),
    (e.CartographyTable = 'minecraft:cartography_table'),
    (e.CarvedPumpkin = 'minecraft:carved_pumpkin'),
    (e.CatSpawnEgg = 'minecraft:cat_spawn_egg'),
    (e.Cauldron = 'minecraft:cauldron'),
    (e.CaveSpiderSpawnEgg = 'minecraft:cave_spider_spawn_egg'),
    (e.ChainCommandBlock = 'minecraft:chain_command_block'),
    (e.ChainmailBoots = 'minecraft:chainmail_boots'),
    (e.ChainmailChestplate = 'minecraft:chainmail_chestplate'),
    (e.ChainmailHelmet = 'minecraft:chainmail_helmet'),
    (e.ChainmailLeggings = 'minecraft:chainmail_leggings'),
    (e.Charcoal = 'minecraft:charcoal'),
    (e.CherryBoat = 'minecraft:cherry_boat'),
    (e.CherryButton = 'minecraft:cherry_button'),
    (e.CherryChestBoat = 'minecraft:cherry_chest_boat'),
    (e.CherryDoor = 'minecraft:cherry_door'),
    (e.CherryFence = 'minecraft:cherry_fence'),
    (e.CherryFenceGate = 'minecraft:cherry_fence_gate'),
    (e.CherryHangingSign = 'minecraft:cherry_hanging_sign'),
    (e.CherryLeaves = 'minecraft:cherry_leaves'),
    (e.CherryLog = 'minecraft:cherry_log'),
    (e.CherryPlanks = 'minecraft:cherry_planks'),
    (e.CherryPressurePlate = 'minecraft:cherry_pressure_plate'),
    (e.CherrySapling = 'minecraft:cherry_sapling'),
    (e.CherryShelf = 'minecraft:cherry_shelf'),
    (e.CherrySign = 'minecraft:cherry_sign'),
    (e.CherrySlab = 'minecraft:cherry_slab'),
    (e.CherryStairs = 'minecraft:cherry_stairs'),
    (e.CherryTrapdoor = 'minecraft:cherry_trapdoor'),
    (e.CherryWood = 'minecraft:cherry_wood'),
    (e.Chest = 'minecraft:chest'),
    (e.ChestMinecart = 'minecraft:chest_minecart'),
    (e.Chicken = 'minecraft:chicken'),
    (e.ChickenSpawnEgg = 'minecraft:chicken_spawn_egg'),
    (e.ChippedAnvil = 'minecraft:chipped_anvil'),
    (e.ChiseledBookshelf = 'minecraft:chiseled_bookshelf'),
    (e.ChiseledCopper = 'minecraft:chiseled_copper'),
    (e.ChiseledDeepslate = 'minecraft:chiseled_deepslate'),
    (e.ChiseledNetherBricks = 'minecraft:chiseled_nether_bricks'),
    (e.ChiseledPolishedBlackstone = 'minecraft:chiseled_polished_blackstone'),
    (e.ChiseledQuartzBlock = 'minecraft:chiseled_quartz_block'),
    (e.ChiseledRedSandstone = 'minecraft:chiseled_red_sandstone'),
    (e.ChiseledResinBricks = 'minecraft:chiseled_resin_bricks'),
    (e.ChiseledSandstone = 'minecraft:chiseled_sandstone'),
    (e.ChiseledStoneBricks = 'minecraft:chiseled_stone_bricks'),
    (e.ChiseledTuff = 'minecraft:chiseled_tuff'),
    (e.ChiseledTuffBricks = 'minecraft:chiseled_tuff_bricks'),
    (e.ChorusFlower = 'minecraft:chorus_flower'),
    (e.ChorusFruit = 'minecraft:chorus_fruit'),
    (e.ChorusPlant = 'minecraft:chorus_plant'),
    (e.Clay = 'minecraft:clay'),
    (e.ClayBall = 'minecraft:clay_ball'),
    (e.Clock = 'minecraft:clock'),
    (e.ClosedEyeblossom = 'minecraft:closed_eyeblossom'),
    (e.Coal = 'minecraft:coal'),
    (e.CoalBlock = 'minecraft:coal_block'),
    (e.CoalOre = 'minecraft:coal_ore'),
    (e.CoarseDirt = 'minecraft:coarse_dirt'),
    (e.CoastArmorTrimSmithingTemplate = 'minecraft:coast_armor_trim_smithing_template'),
    (e.CobbledDeepslate = 'minecraft:cobbled_deepslate'),
    (e.CobbledDeepslateSlab = 'minecraft:cobbled_deepslate_slab'),
    (e.CobbledDeepslateStairs = 'minecraft:cobbled_deepslate_stairs'),
    (e.CobbledDeepslateWall = 'minecraft:cobbled_deepslate_wall'),
    (e.Cobblestone = 'minecraft:cobblestone'),
    (e.CobblestoneSlab = 'minecraft:cobblestone_slab'),
    (e.CobblestoneWall = 'minecraft:cobblestone_wall'),
    (e.CocoaBeans = 'minecraft:cocoa_beans'),
    (e.Cod = 'minecraft:cod'),
    (e.CodBucket = 'minecraft:cod_bucket'),
    (e.CodSpawnEgg = 'minecraft:cod_spawn_egg'),
    (e.CommandBlock = 'minecraft:command_block'),
    (e.CommandBlockMinecart = 'minecraft:command_block_minecart'),
    (e.Comparator = 'minecraft:comparator'),
    (e.Compass = 'minecraft:compass'),
    (e.Composter = 'minecraft:composter'),
    (e.Conduit = 'minecraft:conduit'),
    (e.CookedBeef = 'minecraft:cooked_beef'),
    (e.CookedChicken = 'minecraft:cooked_chicken'),
    (e.CookedCod = 'minecraft:cooked_cod'),
    (e.CookedMutton = 'minecraft:cooked_mutton'),
    (e.CookedPorkchop = 'minecraft:cooked_porkchop'),
    (e.CookedRabbit = 'minecraft:cooked_rabbit'),
    (e.CookedSalmon = 'minecraft:cooked_salmon'),
    (e.Cookie = 'minecraft:cookie'),
    (e.CopperAxe = 'minecraft:copper_axe'),
    (e.CopperBars = 'minecraft:copper_bars'),
    (e.CopperBlock = 'minecraft:copper_block'),
    (e.CopperBoots = 'minecraft:copper_boots'),
    (e.CopperBulb = 'minecraft:copper_bulb'),
    (e.CopperChain = 'minecraft:copper_chain'),
    (e.CopperChest = 'minecraft:copper_chest'),
    (e.CopperChestplate = 'minecraft:copper_chestplate'),
    (e.CopperDoor = 'minecraft:copper_door'),
    (e.CopperGolemSpawnEgg = 'minecraft:copper_golem_spawn_egg'),
    (e.CopperGolemStatue = 'minecraft:copper_golem_statue'),
    (e.CopperGrate = 'minecraft:copper_grate'),
    (e.CopperHelmet = 'minecraft:copper_helmet'),
    (e.CopperHoe = 'minecraft:copper_hoe'),
    (e.CopperHorseArmor = 'minecraft:copper_horse_armor'),
    (e.CopperIngot = 'minecraft:copper_ingot'),
    (e.CopperLantern = 'minecraft:copper_lantern'),
    (e.CopperLeggings = 'minecraft:copper_leggings'),
    (e.CopperNautilusArmor = 'minecraft:copper_nautilus_armor'),
    (e.CopperNugget = 'minecraft:copper_nugget'),
    (e.CopperOre = 'minecraft:copper_ore'),
    (e.CopperPickaxe = 'minecraft:copper_pickaxe'),
    (e.CopperShovel = 'minecraft:copper_shovel'),
    (e.CopperSpear = 'minecraft:copper_spear'),
    (e.CopperSword = 'minecraft:copper_sword'),
    (e.CopperTorch = 'minecraft:copper_torch'),
    (e.CopperTrapdoor = 'minecraft:copper_trapdoor'),
    (e.Cornflower = 'minecraft:cornflower'),
    (e.CowSpawnEgg = 'minecraft:cow_spawn_egg'),
    (e.CrackedDeepslateBricks = 'minecraft:cracked_deepslate_bricks'),
    (e.CrackedDeepslateTiles = 'minecraft:cracked_deepslate_tiles'),
    (e.CrackedNetherBricks = 'minecraft:cracked_nether_bricks'),
    (e.CrackedPolishedBlackstoneBricks = 'minecraft:cracked_polished_blackstone_bricks'),
    (e.CrackedStoneBricks = 'minecraft:cracked_stone_bricks'),
    (e.Crafter = 'minecraft:crafter'),
    (e.CraftingTable = 'minecraft:crafting_table'),
    (e.CreakingHeart = 'minecraft:creaking_heart'),
    (e.CreakingSpawnEgg = 'minecraft:creaking_spawn_egg'),
    (e.CreeperBannerPattern = 'minecraft:creeper_banner_pattern'),
    (e.CreeperHead = 'minecraft:creeper_head'),
    (e.CreeperSpawnEgg = 'minecraft:creeper_spawn_egg'),
    (e.CrimsonButton = 'minecraft:crimson_button'),
    (e.CrimsonDoor = 'minecraft:crimson_door'),
    (e.CrimsonFence = 'minecraft:crimson_fence'),
    (e.CrimsonFenceGate = 'minecraft:crimson_fence_gate'),
    (e.CrimsonFungus = 'minecraft:crimson_fungus'),
    (e.CrimsonHangingSign = 'minecraft:crimson_hanging_sign'),
    (e.CrimsonHyphae = 'minecraft:crimson_hyphae'),
    (e.CrimsonNylium = 'minecraft:crimson_nylium'),
    (e.CrimsonPlanks = 'minecraft:crimson_planks'),
    (e.CrimsonPressurePlate = 'minecraft:crimson_pressure_plate'),
    (e.CrimsonRoots = 'minecraft:crimson_roots'),
    (e.CrimsonShelf = 'minecraft:crimson_shelf'),
    (e.CrimsonSign = 'minecraft:crimson_sign'),
    (e.CrimsonSlab = 'minecraft:crimson_slab'),
    (e.CrimsonStairs = 'minecraft:crimson_stairs'),
    (e.CrimsonStem = 'minecraft:crimson_stem'),
    (e.CrimsonTrapdoor = 'minecraft:crimson_trapdoor'),
    (e.Crossbow = 'minecraft:crossbow'),
    (e.CryingObsidian = 'minecraft:crying_obsidian'),
    (e.CutCopper = 'minecraft:cut_copper'),
    (e.CutCopperSlab = 'minecraft:cut_copper_slab'),
    (e.CutCopperStairs = 'minecraft:cut_copper_stairs'),
    (e.CutRedSandstone = 'minecraft:cut_red_sandstone'),
    (e.CutRedSandstoneSlab = 'minecraft:cut_red_sandstone_slab'),
    (e.CutSandstone = 'minecraft:cut_sandstone'),
    (e.CutSandstoneSlab = 'minecraft:cut_sandstone_slab'),
    (e.CyanBundle = 'minecraft:cyan_bundle'),
    (e.CyanCandle = 'minecraft:cyan_candle'),
    (e.CyanCarpet = 'minecraft:cyan_carpet'),
    (e.CyanConcrete = 'minecraft:cyan_concrete'),
    (e.CyanConcretePowder = 'minecraft:cyan_concrete_powder'),
    (e.CyanDye = 'minecraft:cyan_dye'),
    (e.CyanGlazedTerracotta = 'minecraft:cyan_glazed_terracotta'),
    (e.CyanHarness = 'minecraft:cyan_harness'),
    (e.CyanShulkerBox = 'minecraft:cyan_shulker_box'),
    (e.CyanStainedGlass = 'minecraft:cyan_stained_glass'),
    (e.CyanStainedGlassPane = 'minecraft:cyan_stained_glass_pane'),
    (e.CyanTerracotta = 'minecraft:cyan_terracotta'),
    (e.CyanWool = 'minecraft:cyan_wool'),
    (e.DamagedAnvil = 'minecraft:damaged_anvil'),
    (e.Dandelion = 'minecraft:dandelion'),
    (e.DangerPotterySherd = 'minecraft:danger_pottery_sherd'),
    (e.DarkOakBoat = 'minecraft:dark_oak_boat'),
    (e.DarkOakButton = 'minecraft:dark_oak_button'),
    (e.DarkOakChestBoat = 'minecraft:dark_oak_chest_boat'),
    (e.DarkOakDoor = 'minecraft:dark_oak_door'),
    (e.DarkOakFence = 'minecraft:dark_oak_fence'),
    (e.DarkOakFenceGate = 'minecraft:dark_oak_fence_gate'),
    (e.DarkOakHangingSign = 'minecraft:dark_oak_hanging_sign'),
    (e.DarkOakLeaves = 'minecraft:dark_oak_leaves'),
    (e.DarkOakLog = 'minecraft:dark_oak_log'),
    (e.DarkOakPlanks = 'minecraft:dark_oak_planks'),
    (e.DarkOakPressurePlate = 'minecraft:dark_oak_pressure_plate'),
    (e.DarkOakSapling = 'minecraft:dark_oak_sapling'),
    (e.DarkOakShelf = 'minecraft:dark_oak_shelf'),
    (e.DarkOakSign = 'minecraft:dark_oak_sign'),
    (e.DarkOakSlab = 'minecraft:dark_oak_slab'),
    (e.DarkOakStairs = 'minecraft:dark_oak_stairs'),
    (e.DarkOakTrapdoor = 'minecraft:dark_oak_trapdoor'),
    (e.DarkOakWood = 'minecraft:dark_oak_wood'),
    (e.DarkPrismarine = 'minecraft:dark_prismarine'),
    (e.DarkPrismarineSlab = 'minecraft:dark_prismarine_slab'),
    (e.DarkPrismarineStairs = 'minecraft:dark_prismarine_stairs'),
    (e.DaylightDetector = 'minecraft:daylight_detector'),
    (e.DeadBrainCoral = 'minecraft:dead_brain_coral'),
    (e.DeadBrainCoralBlock = 'minecraft:dead_brain_coral_block'),
    (e.DeadBrainCoralFan = 'minecraft:dead_brain_coral_fan'),
    (e.DeadBubbleCoral = 'minecraft:dead_bubble_coral'),
    (e.DeadBubbleCoralBlock = 'minecraft:dead_bubble_coral_block'),
    (e.DeadBubbleCoralFan = 'minecraft:dead_bubble_coral_fan'),
    (e.DeadFireCoral = 'minecraft:dead_fire_coral'),
    (e.DeadFireCoralBlock = 'minecraft:dead_fire_coral_block'),
    (e.DeadFireCoralFan = 'minecraft:dead_fire_coral_fan'),
    (e.DeadHornCoral = 'minecraft:dead_horn_coral'),
    (e.DeadHornCoralBlock = 'minecraft:dead_horn_coral_block'),
    (e.DeadHornCoralFan = 'minecraft:dead_horn_coral_fan'),
    (e.DeadTubeCoral = 'minecraft:dead_tube_coral'),
    (e.DeadTubeCoralBlock = 'minecraft:dead_tube_coral_block'),
    (e.DeadTubeCoralFan = 'minecraft:dead_tube_coral_fan'),
    (e.Deadbush = 'minecraft:deadbush'),
    (e.DecoratedPot = 'minecraft:decorated_pot'),
    (e.Deepslate = 'minecraft:deepslate'),
    (e.DeepslateBrickSlab = 'minecraft:deepslate_brick_slab'),
    (e.DeepslateBrickStairs = 'minecraft:deepslate_brick_stairs'),
    (e.DeepslateBrickWall = 'minecraft:deepslate_brick_wall'),
    (e.DeepslateBricks = 'minecraft:deepslate_bricks'),
    (e.DeepslateCoalOre = 'minecraft:deepslate_coal_ore'),
    (e.DeepslateCopperOre = 'minecraft:deepslate_copper_ore'),
    (e.DeepslateDiamondOre = 'minecraft:deepslate_diamond_ore'),
    (e.DeepslateEmeraldOre = 'minecraft:deepslate_emerald_ore'),
    (e.DeepslateGoldOre = 'minecraft:deepslate_gold_ore'),
    (e.DeepslateIronOre = 'minecraft:deepslate_iron_ore'),
    (e.DeepslateLapisOre = 'minecraft:deepslate_lapis_ore'),
    (e.DeepslateRedstoneOre = 'minecraft:deepslate_redstone_ore'),
    (e.DeepslateTileSlab = 'minecraft:deepslate_tile_slab'),
    (e.DeepslateTileStairs = 'minecraft:deepslate_tile_stairs'),
    (e.DeepslateTileWall = 'minecraft:deepslate_tile_wall'),
    (e.DeepslateTiles = 'minecraft:deepslate_tiles'),
    (e.Deny = 'minecraft:deny'),
    (e.DetectorRail = 'minecraft:detector_rail'),
    (e.Diamond = 'minecraft:diamond'),
    (e.DiamondAxe = 'minecraft:diamond_axe'),
    (e.DiamondBlock = 'minecraft:diamond_block'),
    (e.DiamondBoots = 'minecraft:diamond_boots'),
    (e.DiamondChestplate = 'minecraft:diamond_chestplate'),
    (e.DiamondHelmet = 'minecraft:diamond_helmet'),
    (e.DiamondHoe = 'minecraft:diamond_hoe'),
    (e.DiamondHorseArmor = 'minecraft:diamond_horse_armor'),
    (e.DiamondLeggings = 'minecraft:diamond_leggings'),
    (e.DiamondNautilusArmor = 'minecraft:diamond_nautilus_armor'),
    (e.DiamondOre = 'minecraft:diamond_ore'),
    (e.DiamondPickaxe = 'minecraft:diamond_pickaxe'),
    (e.DiamondShovel = 'minecraft:diamond_shovel'),
    (e.DiamondSpear = 'minecraft:diamond_spear'),
    (e.DiamondSword = 'minecraft:diamond_sword'),
    (e.Diorite = 'minecraft:diorite'),
    (e.DioriteSlab = 'minecraft:diorite_slab'),
    (e.DioriteStairs = 'minecraft:diorite_stairs'),
    (e.DioriteWall = 'minecraft:diorite_wall'),
    (e.Dirt = 'minecraft:dirt'),
    (e.DirtWithRoots = 'minecraft:dirt_with_roots'),
    (e.DiscFragment5 = 'minecraft:disc_fragment_5'),
    (e.Dispenser = 'minecraft:dispenser'),
    (e.DolphinSpawnEgg = 'minecraft:dolphin_spawn_egg'),
    (e.DonkeySpawnEgg = 'minecraft:donkey_spawn_egg'),
    (e.DragonBreath = 'minecraft:dragon_breath'),
    (e.DragonEgg = 'minecraft:dragon_egg'),
    (e.DragonHead = 'minecraft:dragon_head'),
    (e.DriedGhast = 'minecraft:dried_ghast'),
    (e.DriedKelp = 'minecraft:dried_kelp'),
    (e.DriedKelpBlock = 'minecraft:dried_kelp_block'),
    (e.DripstoneBlock = 'minecraft:dripstone_block'),
    (e.Dropper = 'minecraft:dropper'),
    (e.DrownedSpawnEgg = 'minecraft:drowned_spawn_egg'),
    (e.DuneArmorTrimSmithingTemplate = 'minecraft:dune_armor_trim_smithing_template'),
    (e.EchoShard = 'minecraft:echo_shard'),
    (e.Egg = 'minecraft:egg'),
    (e.ElderGuardianSpawnEgg = 'minecraft:elder_guardian_spawn_egg'),
    (e.Elytra = 'minecraft:elytra'),
    (e.Emerald = 'minecraft:emerald'),
    (e.EmeraldBlock = 'minecraft:emerald_block'),
    (e.EmeraldOre = 'minecraft:emerald_ore'),
    (e.EmptyMap = 'minecraft:empty_map'),
    (e.EnchantedBook = 'minecraft:enchanted_book'),
    (e.EnchantedGoldenApple = 'minecraft:enchanted_golden_apple'),
    (e.EnchantingTable = 'minecraft:enchanting_table'),
    (e.EndBrickStairs = 'minecraft:end_brick_stairs'),
    (e.EndBricks = 'minecraft:end_bricks'),
    (e.EndCrystal = 'minecraft:end_crystal'),
    (e.EndPortalFrame = 'minecraft:end_portal_frame'),
    (e.EndRod = 'minecraft:end_rod'),
    (e.EndStone = 'minecraft:end_stone'),
    (e.EndStoneBrickSlab = 'minecraft:end_stone_brick_slab'),
    (e.EndStoneBrickWall = 'minecraft:end_stone_brick_wall'),
    (e.EnderChest = 'minecraft:ender_chest'),
    (e.EnderDragonSpawnEgg = 'minecraft:ender_dragon_spawn_egg'),
    (e.EnderEye = 'minecraft:ender_eye'),
    (e.EnderPearl = 'minecraft:ender_pearl'),
    (e.EndermanSpawnEgg = 'minecraft:enderman_spawn_egg'),
    (e.EndermiteSpawnEgg = 'minecraft:endermite_spawn_egg'),
    (e.EvokerSpawnEgg = 'minecraft:evoker_spawn_egg'),
    (e.ExperienceBottle = 'minecraft:experience_bottle'),
    (e.ExplorerPotterySherd = 'minecraft:explorer_pottery_sherd'),
    (e.ExposedChiseledCopper = 'minecraft:exposed_chiseled_copper'),
    (e.ExposedCopper = 'minecraft:exposed_copper'),
    (e.ExposedCopperBars = 'minecraft:exposed_copper_bars'),
    (e.ExposedCopperBulb = 'minecraft:exposed_copper_bulb'),
    (e.ExposedCopperChain = 'minecraft:exposed_copper_chain'),
    (e.ExposedCopperChest = 'minecraft:exposed_copper_chest'),
    (e.ExposedCopperDoor = 'minecraft:exposed_copper_door'),
    (e.ExposedCopperGolemStatue = 'minecraft:exposed_copper_golem_statue'),
    (e.ExposedCopperGrate = 'minecraft:exposed_copper_grate'),
    (e.ExposedCopperLantern = 'minecraft:exposed_copper_lantern'),
    (e.ExposedCopperTrapdoor = 'minecraft:exposed_copper_trapdoor'),
    (e.ExposedCutCopper = 'minecraft:exposed_cut_copper'),
    (e.ExposedCutCopperSlab = 'minecraft:exposed_cut_copper_slab'),
    (e.ExposedCutCopperStairs = 'minecraft:exposed_cut_copper_stairs'),
    (e.ExposedLightningRod = 'minecraft:exposed_lightning_rod'),
    (e.EyeArmorTrimSmithingTemplate = 'minecraft:eye_armor_trim_smithing_template'),
    (e.Farmland = 'minecraft:farmland'),
    (e.Feather = 'minecraft:feather'),
    (e.FenceGate = 'minecraft:fence_gate'),
    (e.FermentedSpiderEye = 'minecraft:fermented_spider_eye'),
    (e.Fern = 'minecraft:fern'),
    (e.FieldMasonedBannerPattern = 'minecraft:field_masoned_banner_pattern'),
    (e.FilledMap = 'minecraft:filled_map'),
    (e.FireCharge = 'minecraft:fire_charge'),
    (e.FireCoral = 'minecraft:fire_coral'),
    (e.FireCoralBlock = 'minecraft:fire_coral_block'),
    (e.FireCoralFan = 'minecraft:fire_coral_fan'),
    (e.FireflyBush = 'minecraft:firefly_bush'),
    (e.FireworkRocket = 'minecraft:firework_rocket'),
    (e.FireworkStar = 'minecraft:firework_star'),
    (e.FishingRod = 'minecraft:fishing_rod'),
    (e.FletchingTable = 'minecraft:fletching_table'),
    (e.Flint = 'minecraft:flint'),
    (e.FlintAndSteel = 'minecraft:flint_and_steel'),
    (e.FlowArmorTrimSmithingTemplate = 'minecraft:flow_armor_trim_smithing_template'),
    (e.FlowBannerPattern = 'minecraft:flow_banner_pattern'),
    (e.FlowPotterySherd = 'minecraft:flow_pottery_sherd'),
    (e.FlowerBannerPattern = 'minecraft:flower_banner_pattern'),
    (e.FlowerPot = 'minecraft:flower_pot'),
    (e.FloweringAzalea = 'minecraft:flowering_azalea'),
    (e.FoxSpawnEgg = 'minecraft:fox_spawn_egg'),
    (e.Frame = 'minecraft:frame'),
    (e.FriendPotterySherd = 'minecraft:friend_pottery_sherd'),
    (e.FrogSpawn = 'minecraft:frog_spawn'),
    (e.FrogSpawnEgg = 'minecraft:frog_spawn_egg'),
    (e.FrostedIce = 'minecraft:frosted_ice'),
    (e.Furnace = 'minecraft:furnace'),
    (e.GhastSpawnEgg = 'minecraft:ghast_spawn_egg'),
    (e.GhastTear = 'minecraft:ghast_tear'),
    (e.GildedBlackstone = 'minecraft:gilded_blackstone'),
    (e.Glass = 'minecraft:glass'),
    (e.GlassBottle = 'minecraft:glass_bottle'),
    (e.GlassPane = 'minecraft:glass_pane'),
    (e.GlisteringMelonSlice = 'minecraft:glistering_melon_slice'),
    (e.GlobeBannerPattern = 'minecraft:globe_banner_pattern'),
    (e.GlowBerries = 'minecraft:glow_berries'),
    (e.GlowFrame = 'minecraft:glow_frame'),
    (e.GlowInkSac = 'minecraft:glow_ink_sac'),
    (e.GlowLichen = 'minecraft:glow_lichen'),
    (e.GlowSquidSpawnEgg = 'minecraft:glow_squid_spawn_egg'),
    (e.Glowstone = 'minecraft:glowstone'),
    (e.GlowstoneDust = 'minecraft:glowstone_dust'),
    (e.GoatHorn = 'minecraft:goat_horn'),
    (e.GoatSpawnEgg = 'minecraft:goat_spawn_egg'),
    (e.GoldBlock = 'minecraft:gold_block'),
    (e.GoldIngot = 'minecraft:gold_ingot'),
    (e.GoldNugget = 'minecraft:gold_nugget'),
    (e.GoldOre = 'minecraft:gold_ore'),
    (e.GoldenApple = 'minecraft:golden_apple'),
    (e.GoldenAxe = 'minecraft:golden_axe'),
    (e.GoldenBoots = 'minecraft:golden_boots'),
    (e.GoldenCarrot = 'minecraft:golden_carrot'),
    (e.GoldenChestplate = 'minecraft:golden_chestplate'),
    (e.GoldenHelmet = 'minecraft:golden_helmet'),
    (e.GoldenHoe = 'minecraft:golden_hoe'),
    (e.GoldenHorseArmor = 'minecraft:golden_horse_armor'),
    (e.GoldenLeggings = 'minecraft:golden_leggings'),
    (e.GoldenNautilusArmor = 'minecraft:golden_nautilus_armor'),
    (e.GoldenPickaxe = 'minecraft:golden_pickaxe'),
    (e.GoldenRail = 'minecraft:golden_rail'),
    (e.GoldenShovel = 'minecraft:golden_shovel'),
    (e.GoldenSpear = 'minecraft:golden_spear'),
    (e.GoldenSword = 'minecraft:golden_sword'),
    (e.Granite = 'minecraft:granite'),
    (e.GraniteSlab = 'minecraft:granite_slab'),
    (e.GraniteStairs = 'minecraft:granite_stairs'),
    (e.GraniteWall = 'minecraft:granite_wall'),
    (e.GrassBlock = 'minecraft:grass_block'),
    (e.GrassPath = 'minecraft:grass_path'),
    (e.Gravel = 'minecraft:gravel'),
    (e.GrayBundle = 'minecraft:gray_bundle'),
    (e.GrayCandle = 'minecraft:gray_candle'),
    (e.GrayCarpet = 'minecraft:gray_carpet'),
    (e.GrayConcrete = 'minecraft:gray_concrete'),
    (e.GrayConcretePowder = 'minecraft:gray_concrete_powder'),
    (e.GrayDye = 'minecraft:gray_dye'),
    (e.GrayGlazedTerracotta = 'minecraft:gray_glazed_terracotta'),
    (e.GrayHarness = 'minecraft:gray_harness'),
    (e.GrayShulkerBox = 'minecraft:gray_shulker_box'),
    (e.GrayStainedGlass = 'minecraft:gray_stained_glass'),
    (e.GrayStainedGlassPane = 'minecraft:gray_stained_glass_pane'),
    (e.GrayTerracotta = 'minecraft:gray_terracotta'),
    (e.GrayWool = 'minecraft:gray_wool'),
    (e.GreenBundle = 'minecraft:green_bundle'),
    (e.GreenCandle = 'minecraft:green_candle'),
    (e.GreenCarpet = 'minecraft:green_carpet'),
    (e.GreenConcrete = 'minecraft:green_concrete'),
    (e.GreenConcretePowder = 'minecraft:green_concrete_powder'),
    (e.GreenDye = 'minecraft:green_dye'),
    (e.GreenGlazedTerracotta = 'minecraft:green_glazed_terracotta'),
    (e.GreenHarness = 'minecraft:green_harness'),
    (e.GreenShulkerBox = 'minecraft:green_shulker_box'),
    (e.GreenStainedGlass = 'minecraft:green_stained_glass'),
    (e.GreenStainedGlassPane = 'minecraft:green_stained_glass_pane'),
    (e.GreenTerracotta = 'minecraft:green_terracotta'),
    (e.GreenWool = 'minecraft:green_wool'),
    (e.Grindstone = 'minecraft:grindstone'),
    (e.GuardianSpawnEgg = 'minecraft:guardian_spawn_egg'),
    (e.Gunpowder = 'minecraft:gunpowder'),
    (e.GusterBannerPattern = 'minecraft:guster_banner_pattern'),
    (e.GusterPotterySherd = 'minecraft:guster_pottery_sherd'),
    (e.HangingRoots = 'minecraft:hanging_roots'),
    (e.HappyGhastSpawnEgg = 'minecraft:happy_ghast_spawn_egg'),
    (e.HardenedClay = 'minecraft:hardened_clay'),
    (e.HayBlock = 'minecraft:hay_block'),
    (e.HeartOfTheSea = 'minecraft:heart_of_the_sea'),
    (e.HeartPotterySherd = 'minecraft:heart_pottery_sherd'),
    (e.HeartbreakPotterySherd = 'minecraft:heartbreak_pottery_sherd'),
    (e.HeavyCore = 'minecraft:heavy_core'),
    (e.HeavyWeightedPressurePlate = 'minecraft:heavy_weighted_pressure_plate'),
    (e.HoglinSpawnEgg = 'minecraft:hoglin_spawn_egg'),
    (e.HoneyBlock = 'minecraft:honey_block'),
    (e.HoneyBottle = 'minecraft:honey_bottle'),
    (e.Honeycomb = 'minecraft:honeycomb'),
    (e.HoneycombBlock = 'minecraft:honeycomb_block'),
    (e.Hopper = 'minecraft:hopper'),
    (e.HopperMinecart = 'minecraft:hopper_minecart'),
    (e.HornCoral = 'minecraft:horn_coral'),
    (e.HornCoralBlock = 'minecraft:horn_coral_block'),
    (e.HornCoralFan = 'minecraft:horn_coral_fan'),
    (e.HorseSpawnEgg = 'minecraft:horse_spawn_egg'),
    (e.HostArmorTrimSmithingTemplate = 'minecraft:host_armor_trim_smithing_template'),
    (e.HowlPotterySherd = 'minecraft:howl_pottery_sherd'),
    (e.HuskSpawnEgg = 'minecraft:husk_spawn_egg'),
    (e.Ice = 'minecraft:ice'),
    (e.InfestedChiseledStoneBricks = 'minecraft:infested_chiseled_stone_bricks'),
    (e.InfestedCobblestone = 'minecraft:infested_cobblestone'),
    (e.InfestedCrackedStoneBricks = 'minecraft:infested_cracked_stone_bricks'),
    (e.InfestedDeepslate = 'minecraft:infested_deepslate'),
    (e.InfestedMossyStoneBricks = 'minecraft:infested_mossy_stone_bricks'),
    (e.InfestedStone = 'minecraft:infested_stone'),
    (e.InfestedStoneBricks = 'minecraft:infested_stone_bricks'),
    (e.InkSac = 'minecraft:ink_sac'),
    (e.IronAxe = 'minecraft:iron_axe'),
    (e.IronBars = 'minecraft:iron_bars'),
    (e.IronBlock = 'minecraft:iron_block'),
    (e.IronBoots = 'minecraft:iron_boots'),
    (e.IronChain = 'minecraft:iron_chain'),
    (e.IronChestplate = 'minecraft:iron_chestplate'),
    (e.IronDoor = 'minecraft:iron_door'),
    (e.IronGolemSpawnEgg = 'minecraft:iron_golem_spawn_egg'),
    (e.IronHelmet = 'minecraft:iron_helmet'),
    (e.IronHoe = 'minecraft:iron_hoe'),
    (e.IronHorseArmor = 'minecraft:iron_horse_armor'),
    (e.IronIngot = 'minecraft:iron_ingot'),
    (e.IronLeggings = 'minecraft:iron_leggings'),
    (e.IronNautilusArmor = 'minecraft:iron_nautilus_armor'),
    (e.IronNugget = 'minecraft:iron_nugget'),
    (e.IronOre = 'minecraft:iron_ore'),
    (e.IronPickaxe = 'minecraft:iron_pickaxe'),
    (e.IronShovel = 'minecraft:iron_shovel'),
    (e.IronSpear = 'minecraft:iron_spear'),
    (e.IronSword = 'minecraft:iron_sword'),
    (e.IronTrapdoor = 'minecraft:iron_trapdoor'),
    (e.Jigsaw = 'minecraft:jigsaw'),
    (e.Jukebox = 'minecraft:jukebox'),
    (e.JungleBoat = 'minecraft:jungle_boat'),
    (e.JungleButton = 'minecraft:jungle_button'),
    (e.JungleChestBoat = 'minecraft:jungle_chest_boat'),
    (e.JungleDoor = 'minecraft:jungle_door'),
    (e.JungleFence = 'minecraft:jungle_fence'),
    (e.JungleFenceGate = 'minecraft:jungle_fence_gate'),
    (e.JungleHangingSign = 'minecraft:jungle_hanging_sign'),
    (e.JungleLeaves = 'minecraft:jungle_leaves'),
    (e.JungleLog = 'minecraft:jungle_log'),
    (e.JunglePlanks = 'minecraft:jungle_planks'),
    (e.JunglePressurePlate = 'minecraft:jungle_pressure_plate'),
    (e.JungleSapling = 'minecraft:jungle_sapling'),
    (e.JungleShelf = 'minecraft:jungle_shelf'),
    (e.JungleSign = 'minecraft:jungle_sign'),
    (e.JungleSlab = 'minecraft:jungle_slab'),
    (e.JungleStairs = 'minecraft:jungle_stairs'),
    (e.JungleTrapdoor = 'minecraft:jungle_trapdoor'),
    (e.JungleWood = 'minecraft:jungle_wood'),
    (e.Kelp = 'minecraft:kelp'),
    (e.Ladder = 'minecraft:ladder'),
    (e.Lantern = 'minecraft:lantern'),
    (e.LapisBlock = 'minecraft:lapis_block'),
    (e.LapisLazuli = 'minecraft:lapis_lazuli'),
    (e.LapisOre = 'minecraft:lapis_ore'),
    (e.LargeAmethystBud = 'minecraft:large_amethyst_bud'),
    (e.LargeFern = 'minecraft:large_fern'),
    (e.LavaBucket = 'minecraft:lava_bucket'),
    (e.Lead = 'minecraft:lead'),
    (e.LeafLitter = 'minecraft:leaf_litter'),
    (e.Leather = 'minecraft:leather'),
    (e.LeatherBoots = 'minecraft:leather_boots'),
    (e.LeatherChestplate = 'minecraft:leather_chestplate'),
    (e.LeatherHelmet = 'minecraft:leather_helmet'),
    (e.LeatherHorseArmor = 'minecraft:leather_horse_armor'),
    (e.LeatherLeggings = 'minecraft:leather_leggings'),
    (e.Lectern = 'minecraft:lectern'),
    (e.Lever = 'minecraft:lever'),
    (e.LightBlock0 = 'minecraft:light_block_0'),
    (e.LightBlock1 = 'minecraft:light_block_1'),
    (e.LightBlock10 = 'minecraft:light_block_10'),
    (e.LightBlock11 = 'minecraft:light_block_11'),
    (e.LightBlock12 = 'minecraft:light_block_12'),
    (e.LightBlock13 = 'minecraft:light_block_13'),
    (e.LightBlock14 = 'minecraft:light_block_14'),
    (e.LightBlock15 = 'minecraft:light_block_15'),
    (e.LightBlock2 = 'minecraft:light_block_2'),
    (e.LightBlock3 = 'minecraft:light_block_3'),
    (e.LightBlock4 = 'minecraft:light_block_4'),
    (e.LightBlock5 = 'minecraft:light_block_5'),
    (e.LightBlock6 = 'minecraft:light_block_6'),
    (e.LightBlock7 = 'minecraft:light_block_7'),
    (e.LightBlock8 = 'minecraft:light_block_8'),
    (e.LightBlock9 = 'minecraft:light_block_9'),
    (e.LightBlueBundle = 'minecraft:light_blue_bundle'),
    (e.LightBlueCandle = 'minecraft:light_blue_candle'),
    (e.LightBlueCarpet = 'minecraft:light_blue_carpet'),
    (e.LightBlueConcrete = 'minecraft:light_blue_concrete'),
    (e.LightBlueConcretePowder = 'minecraft:light_blue_concrete_powder'),
    (e.LightBlueDye = 'minecraft:light_blue_dye'),
    (e.LightBlueGlazedTerracotta = 'minecraft:light_blue_glazed_terracotta'),
    (e.LightBlueHarness = 'minecraft:light_blue_harness'),
    (e.LightBlueShulkerBox = 'minecraft:light_blue_shulker_box'),
    (e.LightBlueStainedGlass = 'minecraft:light_blue_stained_glass'),
    (e.LightBlueStainedGlassPane = 'minecraft:light_blue_stained_glass_pane'),
    (e.LightBlueTerracotta = 'minecraft:light_blue_terracotta'),
    (e.LightBlueWool = 'minecraft:light_blue_wool'),
    (e.LightGrayBundle = 'minecraft:light_gray_bundle'),
    (e.LightGrayCandle = 'minecraft:light_gray_candle'),
    (e.LightGrayCarpet = 'minecraft:light_gray_carpet'),
    (e.LightGrayConcrete = 'minecraft:light_gray_concrete'),
    (e.LightGrayConcretePowder = 'minecraft:light_gray_concrete_powder'),
    (e.LightGrayDye = 'minecraft:light_gray_dye'),
    (e.LightGrayHarness = 'minecraft:light_gray_harness'),
    (e.LightGrayShulkerBox = 'minecraft:light_gray_shulker_box'),
    (e.LightGrayStainedGlass = 'minecraft:light_gray_stained_glass'),
    (e.LightGrayStainedGlassPane = 'minecraft:light_gray_stained_glass_pane'),
    (e.LightGrayTerracotta = 'minecraft:light_gray_terracotta'),
    (e.LightGrayWool = 'minecraft:light_gray_wool'),
    (e.LightWeightedPressurePlate = 'minecraft:light_weighted_pressure_plate'),
    (e.LightningRod = 'minecraft:lightning_rod'),
    (e.Lilac = 'minecraft:lilac'),
    (e.LilyOfTheValley = 'minecraft:lily_of_the_valley'),
    (e.LimeBundle = 'minecraft:lime_bundle'),
    (e.LimeCandle = 'minecraft:lime_candle'),
    (e.LimeCarpet = 'minecraft:lime_carpet'),
    (e.LimeConcrete = 'minecraft:lime_concrete'),
    (e.LimeConcretePowder = 'minecraft:lime_concrete_powder'),
    (e.LimeDye = 'minecraft:lime_dye'),
    (e.LimeGlazedTerracotta = 'minecraft:lime_glazed_terracotta'),
    (e.LimeHarness = 'minecraft:lime_harness'),
    (e.LimeShulkerBox = 'minecraft:lime_shulker_box'),
    (e.LimeStainedGlass = 'minecraft:lime_stained_glass'),
    (e.LimeStainedGlassPane = 'minecraft:lime_stained_glass_pane'),
    (e.LimeTerracotta = 'minecraft:lime_terracotta'),
    (e.LimeWool = 'minecraft:lime_wool'),
    (e.LingeringPotion = 'minecraft:lingering_potion'),
    (e.LitPumpkin = 'minecraft:lit_pumpkin'),
    (e.LlamaSpawnEgg = 'minecraft:llama_spawn_egg'),
    (e.Lodestone = 'minecraft:lodestone'),
    (e.LodestoneCompass = 'minecraft:lodestone_compass'),
    (e.Loom = 'minecraft:loom'),
    (e.Mace = 'minecraft:mace'),
    (e.MagentaBundle = 'minecraft:magenta_bundle'),
    (e.MagentaCandle = 'minecraft:magenta_candle'),
    (e.MagentaCarpet = 'minecraft:magenta_carpet'),
    (e.MagentaConcrete = 'minecraft:magenta_concrete'),
    (e.MagentaConcretePowder = 'minecraft:magenta_concrete_powder'),
    (e.MagentaDye = 'minecraft:magenta_dye'),
    (e.MagentaGlazedTerracotta = 'minecraft:magenta_glazed_terracotta'),
    (e.MagentaHarness = 'minecraft:magenta_harness'),
    (e.MagentaShulkerBox = 'minecraft:magenta_shulker_box'),
    (e.MagentaStainedGlass = 'minecraft:magenta_stained_glass'),
    (e.MagentaStainedGlassPane = 'minecraft:magenta_stained_glass_pane'),
    (e.MagentaTerracotta = 'minecraft:magenta_terracotta'),
    (e.MagentaWool = 'minecraft:magenta_wool'),
    (e.Magma = 'minecraft:magma'),
    (e.MagmaCream = 'minecraft:magma_cream'),
    (e.MagmaCubeSpawnEgg = 'minecraft:magma_cube_spawn_egg'),
    (e.MangroveBoat = 'minecraft:mangrove_boat'),
    (e.MangroveButton = 'minecraft:mangrove_button'),
    (e.MangroveChestBoat = 'minecraft:mangrove_chest_boat'),
    (e.MangroveDoor = 'minecraft:mangrove_door'),
    (e.MangroveFence = 'minecraft:mangrove_fence'),
    (e.MangroveFenceGate = 'minecraft:mangrove_fence_gate'),
    (e.MangroveHangingSign = 'minecraft:mangrove_hanging_sign'),
    (e.MangroveLeaves = 'minecraft:mangrove_leaves'),
    (e.MangroveLog = 'minecraft:mangrove_log'),
    (e.MangrovePlanks = 'minecraft:mangrove_planks'),
    (e.MangrovePressurePlate = 'minecraft:mangrove_pressure_plate'),
    (e.MangrovePropagule = 'minecraft:mangrove_propagule'),
    (e.MangroveRoots = 'minecraft:mangrove_roots'),
    (e.MangroveShelf = 'minecraft:mangrove_shelf'),
    (e.MangroveSign = 'minecraft:mangrove_sign'),
    (e.MangroveSlab = 'minecraft:mangrove_slab'),
    (e.MangroveStairs = 'minecraft:mangrove_stairs'),
    (e.MangroveTrapdoor = 'minecraft:mangrove_trapdoor'),
    (e.MangroveWood = 'minecraft:mangrove_wood'),
    (e.MediumAmethystBud = 'minecraft:medium_amethyst_bud'),
    (e.MelonBlock = 'minecraft:melon_block'),
    (e.MelonSeeds = 'minecraft:melon_seeds'),
    (e.MelonSlice = 'minecraft:melon_slice'),
    (e.MilkBucket = 'minecraft:milk_bucket'),
    (e.Minecart = 'minecraft:minecart'),
    (e.MinerPotterySherd = 'minecraft:miner_pottery_sherd'),
    (e.MobSpawner = 'minecraft:mob_spawner'),
    (e.MojangBannerPattern = 'minecraft:mojang_banner_pattern'),
    (e.MooshroomSpawnEgg = 'minecraft:mooshroom_spawn_egg'),
    (e.MossBlock = 'minecraft:moss_block'),
    (e.MossCarpet = 'minecraft:moss_carpet'),
    (e.MossyCobblestone = 'minecraft:mossy_cobblestone'),
    (e.MossyCobblestoneSlab = 'minecraft:mossy_cobblestone_slab'),
    (e.MossyCobblestoneStairs = 'minecraft:mossy_cobblestone_stairs'),
    (e.MossyCobblestoneWall = 'minecraft:mossy_cobblestone_wall'),
    (e.MossyStoneBrickSlab = 'minecraft:mossy_stone_brick_slab'),
    (e.MossyStoneBrickStairs = 'minecraft:mossy_stone_brick_stairs'),
    (e.MossyStoneBrickWall = 'minecraft:mossy_stone_brick_wall'),
    (e.MossyStoneBricks = 'minecraft:mossy_stone_bricks'),
    (e.MournerPotterySherd = 'minecraft:mourner_pottery_sherd'),
    (e.Mud = 'minecraft:mud'),
    (e.MudBrickSlab = 'minecraft:mud_brick_slab'),
    (e.MudBrickStairs = 'minecraft:mud_brick_stairs'),
    (e.MudBrickWall = 'minecraft:mud_brick_wall'),
    (e.MudBricks = 'minecraft:mud_bricks'),
    (e.MuddyMangroveRoots = 'minecraft:muddy_mangrove_roots'),
    (e.MuleSpawnEgg = 'minecraft:mule_spawn_egg'),
    (e.MushroomStem = 'minecraft:mushroom_stem'),
    (e.MushroomStew = 'minecraft:mushroom_stew'),
    (e.MusicDisc11 = 'minecraft:music_disc_11'),
    (e.MusicDisc13 = 'minecraft:music_disc_13'),
    (e.MusicDisc5 = 'minecraft:music_disc_5'),
    (e.MusicDiscBlocks = 'minecraft:music_disc_blocks'),
    (e.MusicDiscCat = 'minecraft:music_disc_cat'),
    (e.MusicDiscChirp = 'minecraft:music_disc_chirp'),
    (e.MusicDiscCreator = 'minecraft:music_disc_creator'),
    (e.MusicDiscCreatorMusicBox = 'minecraft:music_disc_creator_music_box'),
    (e.MusicDiscFar = 'minecraft:music_disc_far'),
    (e.MusicDiscLavaChicken = 'minecraft:music_disc_lava_chicken'),
    (e.MusicDiscMall = 'minecraft:music_disc_mall'),
    (e.MusicDiscMellohi = 'minecraft:music_disc_mellohi'),
    (e.MusicDiscOtherside = 'minecraft:music_disc_otherside'),
    (e.MusicDiscPigstep = 'minecraft:music_disc_pigstep'),
    (e.MusicDiscPrecipice = 'minecraft:music_disc_precipice'),
    (e.MusicDiscRelic = 'minecraft:music_disc_relic'),
    (e.MusicDiscStal = 'minecraft:music_disc_stal'),
    (e.MusicDiscStrad = 'minecraft:music_disc_strad'),
    (e.MusicDiscTears = 'minecraft:music_disc_tears'),
    (e.MusicDiscWait = 'minecraft:music_disc_wait'),
    (e.MusicDiscWard = 'minecraft:music_disc_ward'),
    (e.Mutton = 'minecraft:mutton'),
    (e.Mycelium = 'minecraft:mycelium'),
    (e.NameTag = 'minecraft:name_tag'),
    (e.NautilusShell = 'minecraft:nautilus_shell'),
    (e.NautilusSpawnEgg = 'minecraft:nautilus_spawn_egg'),
    (e.NetherBrick = 'minecraft:nether_brick'),
    (e.NetherBrickFence = 'minecraft:nether_brick_fence'),
    (e.NetherBrickSlab = 'minecraft:nether_brick_slab'),
    (e.NetherBrickStairs = 'minecraft:nether_brick_stairs'),
    (e.NetherBrickWall = 'minecraft:nether_brick_wall'),
    (e.NetherGoldOre = 'minecraft:nether_gold_ore'),
    (e.NetherSprouts = 'minecraft:nether_sprouts'),
    (e.NetherStar = 'minecraft:nether_star'),
    (e.NetherWart = 'minecraft:nether_wart'),
    (e.NetherWartBlock = 'minecraft:nether_wart_block'),
    (e.Netherbrick = 'minecraft:netherbrick'),
    (e.NetheriteAxe = 'minecraft:netherite_axe'),
    (e.NetheriteBlock = 'minecraft:netherite_block'),
    (e.NetheriteBoots = 'minecraft:netherite_boots'),
    (e.NetheriteChestplate = 'minecraft:netherite_chestplate'),
    (e.NetheriteHelmet = 'minecraft:netherite_helmet'),
    (e.NetheriteHoe = 'minecraft:netherite_hoe'),
    (e.NetheriteHorseArmor = 'minecraft:netherite_horse_armor'),
    (e.NetheriteIngot = 'minecraft:netherite_ingot'),
    (e.NetheriteLeggings = 'minecraft:netherite_leggings'),
    (e.NetheriteNautilusArmor = 'minecraft:netherite_nautilus_armor'),
    (e.NetheritePickaxe = 'minecraft:netherite_pickaxe'),
    (e.NetheriteScrap = 'minecraft:netherite_scrap'),
    (e.NetheriteShovel = 'minecraft:netherite_shovel'),
    (e.NetheriteSpear = 'minecraft:netherite_spear'),
    (e.NetheriteSword = 'minecraft:netherite_sword'),
    (e.NetheriteUpgradeSmithingTemplate = 'minecraft:netherite_upgrade_smithing_template'),
    (e.Netherrack = 'minecraft:netherrack'),
    (e.NormalStoneSlab = 'minecraft:normal_stone_slab'),
    (e.NormalStoneStairs = 'minecraft:normal_stone_stairs'),
    (e.Noteblock = 'minecraft:noteblock'),
    (e.OakBoat = 'minecraft:oak_boat'),
    (e.OakChestBoat = 'minecraft:oak_chest_boat'),
    (e.OakFence = 'minecraft:oak_fence'),
    (e.OakHangingSign = 'minecraft:oak_hanging_sign'),
    (e.OakLeaves = 'minecraft:oak_leaves'),
    (e.OakLog = 'minecraft:oak_log'),
    (e.OakPlanks = 'minecraft:oak_planks'),
    (e.OakSapling = 'minecraft:oak_sapling'),
    (e.OakShelf = 'minecraft:oak_shelf'),
    (e.OakSign = 'minecraft:oak_sign'),
    (e.OakSlab = 'minecraft:oak_slab'),
    (e.OakStairs = 'minecraft:oak_stairs'),
    (e.OakWood = 'minecraft:oak_wood'),
    (e.Observer = 'minecraft:observer'),
    (e.Obsidian = 'minecraft:obsidian'),
    (e.OcelotSpawnEgg = 'minecraft:ocelot_spawn_egg'),
    (e.OchreFroglight = 'minecraft:ochre_froglight'),
    (e.OminousBottle = 'minecraft:ominous_bottle'),
    (e.OminousTrialKey = 'minecraft:ominous_trial_key'),
    (e.OpenEyeblossom = 'minecraft:open_eyeblossom'),
    (e.OrangeBundle = 'minecraft:orange_bundle'),
    (e.OrangeCandle = 'minecraft:orange_candle'),
    (e.OrangeCarpet = 'minecraft:orange_carpet'),
    (e.OrangeConcrete = 'minecraft:orange_concrete'),
    (e.OrangeConcretePowder = 'minecraft:orange_concrete_powder'),
    (e.OrangeDye = 'minecraft:orange_dye'),
    (e.OrangeGlazedTerracotta = 'minecraft:orange_glazed_terracotta'),
    (e.OrangeHarness = 'minecraft:orange_harness'),
    (e.OrangeShulkerBox = 'minecraft:orange_shulker_box'),
    (e.OrangeStainedGlass = 'minecraft:orange_stained_glass'),
    (e.OrangeStainedGlassPane = 'minecraft:orange_stained_glass_pane'),
    (e.OrangeTerracotta = 'minecraft:orange_terracotta'),
    (e.OrangeTulip = 'minecraft:orange_tulip'),
    (e.OrangeWool = 'minecraft:orange_wool'),
    (e.OxeyeDaisy = 'minecraft:oxeye_daisy'),
    (e.OxidizedChiseledCopper = 'minecraft:oxidized_chiseled_copper'),
    (e.OxidizedCopper = 'minecraft:oxidized_copper'),
    (e.OxidizedCopperBars = 'minecraft:oxidized_copper_bars'),
    (e.OxidizedCopperBulb = 'minecraft:oxidized_copper_bulb'),
    (e.OxidizedCopperChain = 'minecraft:oxidized_copper_chain'),
    (e.OxidizedCopperChest = 'minecraft:oxidized_copper_chest'),
    (e.OxidizedCopperDoor = 'minecraft:oxidized_copper_door'),
    (e.OxidizedCopperGolemStatue = 'minecraft:oxidized_copper_golem_statue'),
    (e.OxidizedCopperGrate = 'minecraft:oxidized_copper_grate'),
    (e.OxidizedCopperLantern = 'minecraft:oxidized_copper_lantern'),
    (e.OxidizedCopperTrapdoor = 'minecraft:oxidized_copper_trapdoor'),
    (e.OxidizedCutCopper = 'minecraft:oxidized_cut_copper'),
    (e.OxidizedCutCopperSlab = 'minecraft:oxidized_cut_copper_slab'),
    (e.OxidizedCutCopperStairs = 'minecraft:oxidized_cut_copper_stairs'),
    (e.OxidizedLightningRod = 'minecraft:oxidized_lightning_rod'),
    (e.PackedIce = 'minecraft:packed_ice'),
    (e.PackedMud = 'minecraft:packed_mud'),
    (e.Painting = 'minecraft:painting'),
    (e.PaleHangingMoss = 'minecraft:pale_hanging_moss'),
    (e.PaleMossBlock = 'minecraft:pale_moss_block'),
    (e.PaleMossCarpet = 'minecraft:pale_moss_carpet'),
    (e.PaleOakBoat = 'minecraft:pale_oak_boat'),
    (e.PaleOakButton = 'minecraft:pale_oak_button'),
    (e.PaleOakChestBoat = 'minecraft:pale_oak_chest_boat'),
    (e.PaleOakDoor = 'minecraft:pale_oak_door'),
    (e.PaleOakFence = 'minecraft:pale_oak_fence'),
    (e.PaleOakFenceGate = 'minecraft:pale_oak_fence_gate'),
    (e.PaleOakHangingSign = 'minecraft:pale_oak_hanging_sign'),
    (e.PaleOakLeaves = 'minecraft:pale_oak_leaves'),
    (e.PaleOakLog = 'minecraft:pale_oak_log'),
    (e.PaleOakPlanks = 'minecraft:pale_oak_planks'),
    (e.PaleOakPressurePlate = 'minecraft:pale_oak_pressure_plate'),
    (e.PaleOakSapling = 'minecraft:pale_oak_sapling'),
    (e.PaleOakShelf = 'minecraft:pale_oak_shelf'),
    (e.PaleOakSign = 'minecraft:pale_oak_sign'),
    (e.PaleOakSlab = 'minecraft:pale_oak_slab'),
    (e.PaleOakStairs = 'minecraft:pale_oak_stairs'),
    (e.PaleOakTrapdoor = 'minecraft:pale_oak_trapdoor'),
    (e.PaleOakWood = 'minecraft:pale_oak_wood'),
    (e.PandaSpawnEgg = 'minecraft:panda_spawn_egg'),
    (e.Paper = 'minecraft:paper'),
    (e.ParchedSpawnEgg = 'minecraft:parched_spawn_egg'),
    (e.ParrotSpawnEgg = 'minecraft:parrot_spawn_egg'),
    (e.PearlescentFroglight = 'minecraft:pearlescent_froglight'),
    (e.Peony = 'minecraft:peony'),
    (e.PetrifiedOakSlab = 'minecraft:petrified_oak_slab'),
    (e.PhantomMembrane = 'minecraft:phantom_membrane'),
    (e.PhantomSpawnEgg = 'minecraft:phantom_spawn_egg'),
    (e.PigSpawnEgg = 'minecraft:pig_spawn_egg'),
    (e.PiglinBannerPattern = 'minecraft:piglin_banner_pattern'),
    (e.PiglinBruteSpawnEgg = 'minecraft:piglin_brute_spawn_egg'),
    (e.PiglinHead = 'minecraft:piglin_head'),
    (e.PiglinSpawnEgg = 'minecraft:piglin_spawn_egg'),
    (e.PillagerSpawnEgg = 'minecraft:pillager_spawn_egg'),
    (e.PinkBundle = 'minecraft:pink_bundle'),
    (e.PinkCandle = 'minecraft:pink_candle'),
    (e.PinkCarpet = 'minecraft:pink_carpet'),
    (e.PinkConcrete = 'minecraft:pink_concrete'),
    (e.PinkConcretePowder = 'minecraft:pink_concrete_powder'),
    (e.PinkDye = 'minecraft:pink_dye'),
    (e.PinkGlazedTerracotta = 'minecraft:pink_glazed_terracotta'),
    (e.PinkHarness = 'minecraft:pink_harness'),
    (e.PinkPetals = 'minecraft:pink_petals'),
    (e.PinkShulkerBox = 'minecraft:pink_shulker_box'),
    (e.PinkStainedGlass = 'minecraft:pink_stained_glass'),
    (e.PinkStainedGlassPane = 'minecraft:pink_stained_glass_pane'),
    (e.PinkTerracotta = 'minecraft:pink_terracotta'),
    (e.PinkTulip = 'minecraft:pink_tulip'),
    (e.PinkWool = 'minecraft:pink_wool'),
    (e.Piston = 'minecraft:piston'),
    (e.PitcherPlant = 'minecraft:pitcher_plant'),
    (e.PitcherPod = 'minecraft:pitcher_pod'),
    (e.PlayerHead = 'minecraft:player_head'),
    (e.PlentyPotterySherd = 'minecraft:plenty_pottery_sherd'),
    (e.Podzol = 'minecraft:podzol'),
    (e.PointedDripstone = 'minecraft:pointed_dripstone'),
    (e.PoisonousPotato = 'minecraft:poisonous_potato'),
    (e.PolarBearSpawnEgg = 'minecraft:polar_bear_spawn_egg'),
    (e.PolishedAndesite = 'minecraft:polished_andesite'),
    (e.PolishedAndesiteSlab = 'minecraft:polished_andesite_slab'),
    (e.PolishedAndesiteStairs = 'minecraft:polished_andesite_stairs'),
    (e.PolishedBasalt = 'minecraft:polished_basalt'),
    (e.PolishedBlackstone = 'minecraft:polished_blackstone'),
    (e.PolishedBlackstoneBrickSlab = 'minecraft:polished_blackstone_brick_slab'),
    (e.PolishedBlackstoneBrickStairs = 'minecraft:polished_blackstone_brick_stairs'),
    (e.PolishedBlackstoneBrickWall = 'minecraft:polished_blackstone_brick_wall'),
    (e.PolishedBlackstoneBricks = 'minecraft:polished_blackstone_bricks'),
    (e.PolishedBlackstoneButton = 'minecraft:polished_blackstone_button'),
    (e.PolishedBlackstonePressurePlate = 'minecraft:polished_blackstone_pressure_plate'),
    (e.PolishedBlackstoneSlab = 'minecraft:polished_blackstone_slab'),
    (e.PolishedBlackstoneStairs = 'minecraft:polished_blackstone_stairs'),
    (e.PolishedBlackstoneWall = 'minecraft:polished_blackstone_wall'),
    (e.PolishedDeepslate = 'minecraft:polished_deepslate'),
    (e.PolishedDeepslateSlab = 'minecraft:polished_deepslate_slab'),
    (e.PolishedDeepslateStairs = 'minecraft:polished_deepslate_stairs'),
    (e.PolishedDeepslateWall = 'minecraft:polished_deepslate_wall'),
    (e.PolishedDiorite = 'minecraft:polished_diorite'),
    (e.PolishedDioriteSlab = 'minecraft:polished_diorite_slab'),
    (e.PolishedDioriteStairs = 'minecraft:polished_diorite_stairs'),
    (e.PolishedGranite = 'minecraft:polished_granite'),
    (e.PolishedGraniteSlab = 'minecraft:polished_granite_slab'),
    (e.PolishedGraniteStairs = 'minecraft:polished_granite_stairs'),
    (e.PolishedTuff = 'minecraft:polished_tuff'),
    (e.PolishedTuffSlab = 'minecraft:polished_tuff_slab'),
    (e.PolishedTuffStairs = 'minecraft:polished_tuff_stairs'),
    (e.PolishedTuffWall = 'minecraft:polished_tuff_wall'),
    (e.PoppedChorusFruit = 'minecraft:popped_chorus_fruit'),
    (e.Poppy = 'minecraft:poppy'),
    (e.Porkchop = 'minecraft:porkchop'),
    (e.Potato = 'minecraft:potato'),
    (e.Potion = 'minecraft:potion'),
    (e.PowderSnowBucket = 'minecraft:powder_snow_bucket'),
    (e.Prismarine = 'minecraft:prismarine'),
    (e.PrismarineBrickSlab = 'minecraft:prismarine_brick_slab'),
    (e.PrismarineBricks = 'minecraft:prismarine_bricks'),
    (e.PrismarineBricksStairs = 'minecraft:prismarine_bricks_stairs'),
    (e.PrismarineCrystals = 'minecraft:prismarine_crystals'),
    (e.PrismarineShard = 'minecraft:prismarine_shard'),
    (e.PrismarineSlab = 'minecraft:prismarine_slab'),
    (e.PrismarineStairs = 'minecraft:prismarine_stairs'),
    (e.PrismarineWall = 'minecraft:prismarine_wall'),
    (e.PrizePotterySherd = 'minecraft:prize_pottery_sherd'),
    (e.Pufferfish = 'minecraft:pufferfish'),
    (e.PufferfishBucket = 'minecraft:pufferfish_bucket'),
    (e.PufferfishSpawnEgg = 'minecraft:pufferfish_spawn_egg'),
    (e.Pumpkin = 'minecraft:pumpkin'),
    (e.PumpkinPie = 'minecraft:pumpkin_pie'),
    (e.PumpkinSeeds = 'minecraft:pumpkin_seeds'),
    (e.PurpleBundle = 'minecraft:purple_bundle'),
    (e.PurpleCandle = 'minecraft:purple_candle'),
    (e.PurpleCarpet = 'minecraft:purple_carpet'),
    (e.PurpleConcrete = 'minecraft:purple_concrete'),
    (e.PurpleConcretePowder = 'minecraft:purple_concrete_powder'),
    (e.PurpleDye = 'minecraft:purple_dye'),
    (e.PurpleGlazedTerracotta = 'minecraft:purple_glazed_terracotta'),
    (e.PurpleHarness = 'minecraft:purple_harness'),
    (e.PurpleShulkerBox = 'minecraft:purple_shulker_box'),
    (e.PurpleStainedGlass = 'minecraft:purple_stained_glass'),
    (e.PurpleStainedGlassPane = 'minecraft:purple_stained_glass_pane'),
    (e.PurpleTerracotta = 'minecraft:purple_terracotta'),
    (e.PurpleWool = 'minecraft:purple_wool'),
    (e.PurpurBlock = 'minecraft:purpur_block'),
    (e.PurpurPillar = 'minecraft:purpur_pillar'),
    (e.PurpurSlab = 'minecraft:purpur_slab'),
    (e.PurpurStairs = 'minecraft:purpur_stairs'),
    (e.Quartz = 'minecraft:quartz'),
    (e.QuartzBlock = 'minecraft:quartz_block'),
    (e.QuartzBricks = 'minecraft:quartz_bricks'),
    (e.QuartzOre = 'minecraft:quartz_ore'),
    (e.QuartzPillar = 'minecraft:quartz_pillar'),
    (e.QuartzSlab = 'minecraft:quartz_slab'),
    (e.QuartzStairs = 'minecraft:quartz_stairs'),
    (e.Rabbit = 'minecraft:rabbit'),
    (e.RabbitFoot = 'minecraft:rabbit_foot'),
    (e.RabbitHide = 'minecraft:rabbit_hide'),
    (e.RabbitSpawnEgg = 'minecraft:rabbit_spawn_egg'),
    (e.RabbitStew = 'minecraft:rabbit_stew'),
    (e.Rail = 'minecraft:rail'),
    (e.RaiserArmorTrimSmithingTemplate = 'minecraft:raiser_armor_trim_smithing_template'),
    (e.RavagerSpawnEgg = 'minecraft:ravager_spawn_egg'),
    (e.RawCopper = 'minecraft:raw_copper'),
    (e.RawCopperBlock = 'minecraft:raw_copper_block'),
    (e.RawGold = 'minecraft:raw_gold'),
    (e.RawGoldBlock = 'minecraft:raw_gold_block'),
    (e.RawIron = 'minecraft:raw_iron'),
    (e.RawIronBlock = 'minecraft:raw_iron_block'),
    (e.RecoveryCompass = 'minecraft:recovery_compass'),
    (e.RedBundle = 'minecraft:red_bundle'),
    (e.RedCandle = 'minecraft:red_candle'),
    (e.RedCarpet = 'minecraft:red_carpet'),
    (e.RedConcrete = 'minecraft:red_concrete'),
    (e.RedConcretePowder = 'minecraft:red_concrete_powder'),
    (e.RedDye = 'minecraft:red_dye'),
    (e.RedGlazedTerracotta = 'minecraft:red_glazed_terracotta'),
    (e.RedHarness = 'minecraft:red_harness'),
    (e.RedMushroom = 'minecraft:red_mushroom'),
    (e.RedMushroomBlock = 'minecraft:red_mushroom_block'),
    (e.RedNetherBrick = 'minecraft:red_nether_brick'),
    (e.RedNetherBrickSlab = 'minecraft:red_nether_brick_slab'),
    (e.RedNetherBrickStairs = 'minecraft:red_nether_brick_stairs'),
    (e.RedNetherBrickWall = 'minecraft:red_nether_brick_wall'),
    (e.RedSand = 'minecraft:red_sand'),
    (e.RedSandstone = 'minecraft:red_sandstone'),
    (e.RedSandstoneSlab = 'minecraft:red_sandstone_slab'),
    (e.RedSandstoneStairs = 'minecraft:red_sandstone_stairs'),
    (e.RedSandstoneWall = 'minecraft:red_sandstone_wall'),
    (e.RedShulkerBox = 'minecraft:red_shulker_box'),
    (e.RedStainedGlass = 'minecraft:red_stained_glass'),
    (e.RedStainedGlassPane = 'minecraft:red_stained_glass_pane'),
    (e.RedTerracotta = 'minecraft:red_terracotta'),
    (e.RedTulip = 'minecraft:red_tulip'),
    (e.RedWool = 'minecraft:red_wool'),
    (e.Redstone = 'minecraft:redstone'),
    (e.RedstoneBlock = 'minecraft:redstone_block'),
    (e.RedstoneLamp = 'minecraft:redstone_lamp'),
    (e.RedstoneOre = 'minecraft:redstone_ore'),
    (e.RedstoneTorch = 'minecraft:redstone_torch'),
    (e.ReinforcedDeepslate = 'minecraft:reinforced_deepslate'),
    (e.Repeater = 'minecraft:repeater'),
    (e.RepeatingCommandBlock = 'minecraft:repeating_command_block'),
    (e.ResinBlock = 'minecraft:resin_block'),
    (e.ResinBrick = 'minecraft:resin_brick'),
    (e.ResinBrickSlab = 'minecraft:resin_brick_slab'),
    (e.ResinBrickStairs = 'minecraft:resin_brick_stairs'),
    (e.ResinBrickWall = 'minecraft:resin_brick_wall'),
    (e.ResinBricks = 'minecraft:resin_bricks'),
    (e.ResinClump = 'minecraft:resin_clump'),
    (e.RespawnAnchor = 'minecraft:respawn_anchor'),
    (e.RibArmorTrimSmithingTemplate = 'minecraft:rib_armor_trim_smithing_template'),
    (e.RoseBush = 'minecraft:rose_bush'),
    (e.RottenFlesh = 'minecraft:rotten_flesh'),
    (e.Saddle = 'minecraft:saddle'),
    (e.Salmon = 'minecraft:salmon'),
    (e.SalmonBucket = 'minecraft:salmon_bucket'),
    (e.SalmonSpawnEgg = 'minecraft:salmon_spawn_egg'),
    (e.Sand = 'minecraft:sand'),
    (e.Sandstone = 'minecraft:sandstone'),
    (e.SandstoneSlab = 'minecraft:sandstone_slab'),
    (e.SandstoneStairs = 'minecraft:sandstone_stairs'),
    (e.SandstoneWall = 'minecraft:sandstone_wall'),
    (e.Scaffolding = 'minecraft:scaffolding'),
    (e.ScrapePotterySherd = 'minecraft:scrape_pottery_sherd'),
    (e.Sculk = 'minecraft:sculk'),
    (e.SculkCatalyst = 'minecraft:sculk_catalyst'),
    (e.SculkSensor = 'minecraft:sculk_sensor'),
    (e.SculkShrieker = 'minecraft:sculk_shrieker'),
    (e.SculkVein = 'minecraft:sculk_vein'),
    (e.SeaLantern = 'minecraft:sea_lantern'),
    (e.SeaPickle = 'minecraft:sea_pickle'),
    (e.Seagrass = 'minecraft:seagrass'),
    (e.SentryArmorTrimSmithingTemplate = 'minecraft:sentry_armor_trim_smithing_template'),
    (e.ShaperArmorTrimSmithingTemplate = 'minecraft:shaper_armor_trim_smithing_template'),
    (e.SheafPotterySherd = 'minecraft:sheaf_pottery_sherd'),
    (e.Shears = 'minecraft:shears'),
    (e.SheepSpawnEgg = 'minecraft:sheep_spawn_egg'),
    (e.ShelterPotterySherd = 'minecraft:shelter_pottery_sherd'),
    (e.Shield = 'minecraft:shield'),
    (e.ShortDryGrass = 'minecraft:short_dry_grass'),
    (e.ShortGrass = 'minecraft:short_grass'),
    (e.Shroomlight = 'minecraft:shroomlight'),
    (e.ShulkerShell = 'minecraft:shulker_shell'),
    (e.ShulkerSpawnEgg = 'minecraft:shulker_spawn_egg'),
    (e.SilenceArmorTrimSmithingTemplate = 'minecraft:silence_armor_trim_smithing_template'),
    (e.SilverGlazedTerracotta = 'minecraft:silver_glazed_terracotta'),
    (e.SilverfishSpawnEgg = 'minecraft:silverfish_spawn_egg'),
    (e.SkeletonHorseSpawnEgg = 'minecraft:skeleton_horse_spawn_egg'),
    (e.SkeletonSkull = 'minecraft:skeleton_skull'),
    (e.SkeletonSpawnEgg = 'minecraft:skeleton_spawn_egg'),
    (e.SkullBannerPattern = 'minecraft:skull_banner_pattern'),
    (e.SkullPotterySherd = 'minecraft:skull_pottery_sherd'),
    (e.Slime = 'minecraft:slime'),
    (e.SlimeBall = 'minecraft:slime_ball'),
    (e.SlimeSpawnEgg = 'minecraft:slime_spawn_egg'),
    (e.SmallAmethystBud = 'minecraft:small_amethyst_bud'),
    (e.SmallDripleafBlock = 'minecraft:small_dripleaf_block'),
    (e.SmithingTable = 'minecraft:smithing_table'),
    (e.Smoker = 'minecraft:smoker'),
    (e.SmoothBasalt = 'minecraft:smooth_basalt'),
    (e.SmoothQuartz = 'minecraft:smooth_quartz'),
    (e.SmoothQuartzSlab = 'minecraft:smooth_quartz_slab'),
    (e.SmoothQuartzStairs = 'minecraft:smooth_quartz_stairs'),
    (e.SmoothRedSandstone = 'minecraft:smooth_red_sandstone'),
    (e.SmoothRedSandstoneSlab = 'minecraft:smooth_red_sandstone_slab'),
    (e.SmoothRedSandstoneStairs = 'minecraft:smooth_red_sandstone_stairs'),
    (e.SmoothSandstone = 'minecraft:smooth_sandstone'),
    (e.SmoothSandstoneSlab = 'minecraft:smooth_sandstone_slab'),
    (e.SmoothSandstoneStairs = 'minecraft:smooth_sandstone_stairs'),
    (e.SmoothStone = 'minecraft:smooth_stone'),
    (e.SmoothStoneSlab = 'minecraft:smooth_stone_slab'),
    (e.SnifferEgg = 'minecraft:sniffer_egg'),
    (e.SnifferSpawnEgg = 'minecraft:sniffer_spawn_egg'),
    (e.SnortPotterySherd = 'minecraft:snort_pottery_sherd'),
    (e.SnoutArmorTrimSmithingTemplate = 'minecraft:snout_armor_trim_smithing_template'),
    (e.Snow = 'minecraft:snow'),
    (e.SnowGolemSpawnEgg = 'minecraft:snow_golem_spawn_egg'),
    (e.SnowLayer = 'minecraft:snow_layer'),
    (e.Snowball = 'minecraft:snowball'),
    (e.SoulCampfire = 'minecraft:soul_campfire'),
    (e.SoulLantern = 'minecraft:soul_lantern'),
    (e.SoulSand = 'minecraft:soul_sand'),
    (e.SoulSoil = 'minecraft:soul_soil'),
    (e.SoulTorch = 'minecraft:soul_torch'),
    (e.SpiderEye = 'minecraft:spider_eye'),
    (e.SpiderSpawnEgg = 'minecraft:spider_spawn_egg'),
    (e.SpireArmorTrimSmithingTemplate = 'minecraft:spire_armor_trim_smithing_template'),
    (e.SplashPotion = 'minecraft:splash_potion'),
    (e.Sponge = 'minecraft:sponge'),
    (e.SporeBlossom = 'minecraft:spore_blossom'),
    (e.SpruceBoat = 'minecraft:spruce_boat'),
    (e.SpruceButton = 'minecraft:spruce_button'),
    (e.SpruceChestBoat = 'minecraft:spruce_chest_boat'),
    (e.SpruceDoor = 'minecraft:spruce_door'),
    (e.SpruceFence = 'minecraft:spruce_fence'),
    (e.SpruceFenceGate = 'minecraft:spruce_fence_gate'),
    (e.SpruceHangingSign = 'minecraft:spruce_hanging_sign'),
    (e.SpruceLeaves = 'minecraft:spruce_leaves'),
    (e.SpruceLog = 'minecraft:spruce_log'),
    (e.SprucePlanks = 'minecraft:spruce_planks'),
    (e.SprucePressurePlate = 'minecraft:spruce_pressure_plate'),
    (e.SpruceSapling = 'minecraft:spruce_sapling'),
    (e.SpruceShelf = 'minecraft:spruce_shelf'),
    (e.SpruceSign = 'minecraft:spruce_sign'),
    (e.SpruceSlab = 'minecraft:spruce_slab'),
    (e.SpruceStairs = 'minecraft:spruce_stairs'),
    (e.SpruceTrapdoor = 'minecraft:spruce_trapdoor'),
    (e.SpruceWood = 'minecraft:spruce_wood'),
    (e.Spyglass = 'minecraft:spyglass'),
    (e.SquidSpawnEgg = 'minecraft:squid_spawn_egg'),
    (e.Stick = 'minecraft:stick'),
    (e.StickyPiston = 'minecraft:sticky_piston'),
    (e.Stone = 'minecraft:stone'),
    (e.StoneAxe = 'minecraft:stone_axe'),
    (e.StoneBrickSlab = 'minecraft:stone_brick_slab'),
    (e.StoneBrickStairs = 'minecraft:stone_brick_stairs'),
    (e.StoneBrickWall = 'minecraft:stone_brick_wall'),
    (e.StoneBricks = 'minecraft:stone_bricks'),
    (e.StoneButton = 'minecraft:stone_button'),
    (e.StoneHoe = 'minecraft:stone_hoe'),
    (e.StonePickaxe = 'minecraft:stone_pickaxe'),
    (e.StonePressurePlate = 'minecraft:stone_pressure_plate'),
    (e.StoneShovel = 'minecraft:stone_shovel'),
    (e.StoneSpear = 'minecraft:stone_spear'),
    (e.StoneStairs = 'minecraft:stone_stairs'),
    (e.StoneSword = 'minecraft:stone_sword'),
    (e.StonecutterBlock = 'minecraft:stonecutter_block'),
    (e.StraySpawnEgg = 'minecraft:stray_spawn_egg'),
    (e.StriderSpawnEgg = 'minecraft:strider_spawn_egg'),
    (e.String = 'minecraft:string'),
    (e.StrippedAcaciaLog = 'minecraft:stripped_acacia_log'),
    (e.StrippedAcaciaWood = 'minecraft:stripped_acacia_wood'),
    (e.StrippedBambooBlock = 'minecraft:stripped_bamboo_block'),
    (e.StrippedBirchLog = 'minecraft:stripped_birch_log'),
    (e.StrippedBirchWood = 'minecraft:stripped_birch_wood'),
    (e.StrippedCherryLog = 'minecraft:stripped_cherry_log'),
    (e.StrippedCherryWood = 'minecraft:stripped_cherry_wood'),
    (e.StrippedCrimsonHyphae = 'minecraft:stripped_crimson_hyphae'),
    (e.StrippedCrimsonStem = 'minecraft:stripped_crimson_stem'),
    (e.StrippedDarkOakLog = 'minecraft:stripped_dark_oak_log'),
    (e.StrippedDarkOakWood = 'minecraft:stripped_dark_oak_wood'),
    (e.StrippedJungleLog = 'minecraft:stripped_jungle_log'),
    (e.StrippedJungleWood = 'minecraft:stripped_jungle_wood'),
    (e.StrippedMangroveLog = 'minecraft:stripped_mangrove_log'),
    (e.StrippedMangroveWood = 'minecraft:stripped_mangrove_wood'),
    (e.StrippedOakLog = 'minecraft:stripped_oak_log'),
    (e.StrippedOakWood = 'minecraft:stripped_oak_wood'),
    (e.StrippedPaleOakLog = 'minecraft:stripped_pale_oak_log'),
    (e.StrippedPaleOakWood = 'minecraft:stripped_pale_oak_wood'),
    (e.StrippedSpruceLog = 'minecraft:stripped_spruce_log'),
    (e.StrippedSpruceWood = 'minecraft:stripped_spruce_wood'),
    (e.StrippedWarpedHyphae = 'minecraft:stripped_warped_hyphae'),
    (e.StrippedWarpedStem = 'minecraft:stripped_warped_stem'),
    (e.StructureBlock = 'minecraft:structure_block'),
    (e.StructureVoid = 'minecraft:structure_void'),
    (e.Sugar = 'minecraft:sugar'),
    (e.SugarCane = 'minecraft:sugar_cane'),
    (e.Sunflower = 'minecraft:sunflower'),
    (e.SuspiciousGravel = 'minecraft:suspicious_gravel'),
    (e.SuspiciousSand = 'minecraft:suspicious_sand'),
    (e.SuspiciousStew = 'minecraft:suspicious_stew'),
    (e.SweetBerries = 'minecraft:sweet_berries'),
    (e.TadpoleBucket = 'minecraft:tadpole_bucket'),
    (e.TadpoleSpawnEgg = 'minecraft:tadpole_spawn_egg'),
    (e.TallDryGrass = 'minecraft:tall_dry_grass'),
    (e.TallGrass = 'minecraft:tall_grass'),
    (e.Target = 'minecraft:target'),
    (e.TideArmorTrimSmithingTemplate = 'minecraft:tide_armor_trim_smithing_template'),
    (e.TintedGlass = 'minecraft:tinted_glass'),
    (e.Tnt = 'minecraft:tnt'),
    (e.TntMinecart = 'minecraft:tnt_minecart'),
    (e.Torch = 'minecraft:torch'),
    (e.Torchflower = 'minecraft:torchflower'),
    (e.TorchflowerSeeds = 'minecraft:torchflower_seeds'),
    (e.TotemOfUndying = 'minecraft:totem_of_undying'),
    (e.TraderLlamaSpawnEgg = 'minecraft:trader_llama_spawn_egg'),
    (e.Trapdoor = 'minecraft:trapdoor'),
    (e.TrappedChest = 'minecraft:trapped_chest'),
    (e.TrialKey = 'minecraft:trial_key'),
    (e.TrialSpawner = 'minecraft:trial_spawner'),
    (e.Trident = 'minecraft:trident'),
    (e.TripwireHook = 'minecraft:tripwire_hook'),
    (e.TropicalFish = 'minecraft:tropical_fish'),
    (e.TropicalFishBucket = 'minecraft:tropical_fish_bucket'),
    (e.TropicalFishSpawnEgg = 'minecraft:tropical_fish_spawn_egg'),
    (e.TubeCoral = 'minecraft:tube_coral'),
    (e.TubeCoralBlock = 'minecraft:tube_coral_block'),
    (e.TubeCoralFan = 'minecraft:tube_coral_fan'),
    (e.Tuff = 'minecraft:tuff'),
    (e.TuffBrickSlab = 'minecraft:tuff_brick_slab'),
    (e.TuffBrickStairs = 'minecraft:tuff_brick_stairs'),
    (e.TuffBrickWall = 'minecraft:tuff_brick_wall'),
    (e.TuffBricks = 'minecraft:tuff_bricks'),
    (e.TuffSlab = 'minecraft:tuff_slab'),
    (e.TuffStairs = 'minecraft:tuff_stairs'),
    (e.TuffWall = 'minecraft:tuff_wall'),
    (e.TurtleEgg = 'minecraft:turtle_egg'),
    (e.TurtleHelmet = 'minecraft:turtle_helmet'),
    (e.TurtleScute = 'minecraft:turtle_scute'),
    (e.TurtleSpawnEgg = 'minecraft:turtle_spawn_egg'),
    (e.TwistingVines = 'minecraft:twisting_vines'),
    (e.UndyedShulkerBox = 'minecraft:undyed_shulker_box'),
    (e.Vault = 'minecraft:vault'),
    (e.VerdantFroglight = 'minecraft:verdant_froglight'),
    (e.VexArmorTrimSmithingTemplate = 'minecraft:vex_armor_trim_smithing_template'),
    (e.VexSpawnEgg = 'minecraft:vex_spawn_egg'),
    (e.VillagerSpawnEgg = 'minecraft:villager_spawn_egg'),
    (e.VindicatorSpawnEgg = 'minecraft:vindicator_spawn_egg'),
    (e.Vine = 'minecraft:vine'),
    (e.WanderingTraderSpawnEgg = 'minecraft:wandering_trader_spawn_egg'),
    (e.WardArmorTrimSmithingTemplate = 'minecraft:ward_armor_trim_smithing_template'),
    (e.WardenSpawnEgg = 'minecraft:warden_spawn_egg'),
    (e.WarpedButton = 'minecraft:warped_button'),
    (e.WarpedDoor = 'minecraft:warped_door'),
    (e.WarpedFence = 'minecraft:warped_fence'),
    (e.WarpedFenceGate = 'minecraft:warped_fence_gate'),
    (e.WarpedFungus = 'minecraft:warped_fungus'),
    (e.WarpedFungusOnAStick = 'minecraft:warped_fungus_on_a_stick'),
    (e.WarpedHangingSign = 'minecraft:warped_hanging_sign'),
    (e.WarpedHyphae = 'minecraft:warped_hyphae'),
    (e.WarpedNylium = 'minecraft:warped_nylium'),
    (e.WarpedPlanks = 'minecraft:warped_planks'),
    (e.WarpedPressurePlate = 'minecraft:warped_pressure_plate'),
    (e.WarpedRoots = 'minecraft:warped_roots'),
    (e.WarpedShelf = 'minecraft:warped_shelf'),
    (e.WarpedSign = 'minecraft:warped_sign'),
    (e.WarpedSlab = 'minecraft:warped_slab'),
    (e.WarpedStairs = 'minecraft:warped_stairs'),
    (e.WarpedStem = 'minecraft:warped_stem'),
    (e.WarpedTrapdoor = 'minecraft:warped_trapdoor'),
    (e.WarpedWartBlock = 'minecraft:warped_wart_block'),
    (e.WaterBucket = 'minecraft:water_bucket'),
    (e.Waterlily = 'minecraft:waterlily'),
    (e.WaxedChiseledCopper = 'minecraft:waxed_chiseled_copper'),
    (e.WaxedCopper = 'minecraft:waxed_copper'),
    (e.WaxedCopperBars = 'minecraft:waxed_copper_bars'),
    (e.WaxedCopperBulb = 'minecraft:waxed_copper_bulb'),
    (e.WaxedCopperChain = 'minecraft:waxed_copper_chain'),
    (e.WaxedCopperChest = 'minecraft:waxed_copper_chest'),
    (e.WaxedCopperDoor = 'minecraft:waxed_copper_door'),
    (e.WaxedCopperGolemStatue = 'minecraft:waxed_copper_golem_statue'),
    (e.WaxedCopperGrate = 'minecraft:waxed_copper_grate'),
    (e.WaxedCopperLantern = 'minecraft:waxed_copper_lantern'),
    (e.WaxedCopperTrapdoor = 'minecraft:waxed_copper_trapdoor'),
    (e.WaxedCutCopper = 'minecraft:waxed_cut_copper'),
    (e.WaxedCutCopperSlab = 'minecraft:waxed_cut_copper_slab'),
    (e.WaxedCutCopperStairs = 'minecraft:waxed_cut_copper_stairs'),
    (e.WaxedExposedChiseledCopper = 'minecraft:waxed_exposed_chiseled_copper'),
    (e.WaxedExposedCopper = 'minecraft:waxed_exposed_copper'),
    (e.WaxedExposedCopperBars = 'minecraft:waxed_exposed_copper_bars'),
    (e.WaxedExposedCopperBulb = 'minecraft:waxed_exposed_copper_bulb'),
    (e.WaxedExposedCopperChain = 'minecraft:waxed_exposed_copper_chain'),
    (e.WaxedExposedCopperChest = 'minecraft:waxed_exposed_copper_chest'),
    (e.WaxedExposedCopperDoor = 'minecraft:waxed_exposed_copper_door'),
    (e.WaxedExposedCopperGolemStatue = 'minecraft:waxed_exposed_copper_golem_statue'),
    (e.WaxedExposedCopperGrate = 'minecraft:waxed_exposed_copper_grate'),
    (e.WaxedExposedCopperLantern = 'minecraft:waxed_exposed_copper_lantern'),
    (e.WaxedExposedCopperTrapdoor = 'minecraft:waxed_exposed_copper_trapdoor'),
    (e.WaxedExposedCutCopper = 'minecraft:waxed_exposed_cut_copper'),
    (e.WaxedExposedCutCopperSlab = 'minecraft:waxed_exposed_cut_copper_slab'),
    (e.WaxedExposedCutCopperStairs = 'minecraft:waxed_exposed_cut_copper_stairs'),
    (e.WaxedExposedLightningRod = 'minecraft:waxed_exposed_lightning_rod'),
    (e.WaxedLightningRod = 'minecraft:waxed_lightning_rod'),
    (e.WaxedOxidizedChiseledCopper = 'minecraft:waxed_oxidized_chiseled_copper'),
    (e.WaxedOxidizedCopper = 'minecraft:waxed_oxidized_copper'),
    (e.WaxedOxidizedCopperBars = 'minecraft:waxed_oxidized_copper_bars'),
    (e.WaxedOxidizedCopperBulb = 'minecraft:waxed_oxidized_copper_bulb'),
    (e.WaxedOxidizedCopperChain = 'minecraft:waxed_oxidized_copper_chain'),
    (e.WaxedOxidizedCopperChest = 'minecraft:waxed_oxidized_copper_chest'),
    (e.WaxedOxidizedCopperDoor = 'minecraft:waxed_oxidized_copper_door'),
    (e.WaxedOxidizedCopperGolemStatue = 'minecraft:waxed_oxidized_copper_golem_statue'),
    (e.WaxedOxidizedCopperGrate = 'minecraft:waxed_oxidized_copper_grate'),
    (e.WaxedOxidizedCopperLantern = 'minecraft:waxed_oxidized_copper_lantern'),
    (e.WaxedOxidizedCopperTrapdoor = 'minecraft:waxed_oxidized_copper_trapdoor'),
    (e.WaxedOxidizedCutCopper = 'minecraft:waxed_oxidized_cut_copper'),
    (e.WaxedOxidizedCutCopperSlab = 'minecraft:waxed_oxidized_cut_copper_slab'),
    (e.WaxedOxidizedCutCopperStairs = 'minecraft:waxed_oxidized_cut_copper_stairs'),
    (e.WaxedOxidizedLightningRod = 'minecraft:waxed_oxidized_lightning_rod'),
    (e.WaxedWeatheredChiseledCopper = 'minecraft:waxed_weathered_chiseled_copper'),
    (e.WaxedWeatheredCopper = 'minecraft:waxed_weathered_copper'),
    (e.WaxedWeatheredCopperBars = 'minecraft:waxed_weathered_copper_bars'),
    (e.WaxedWeatheredCopperBulb = 'minecraft:waxed_weathered_copper_bulb'),
    (e.WaxedWeatheredCopperChain = 'minecraft:waxed_weathered_copper_chain'),
    (e.WaxedWeatheredCopperChest = 'minecraft:waxed_weathered_copper_chest'),
    (e.WaxedWeatheredCopperDoor = 'minecraft:waxed_weathered_copper_door'),
    (e.WaxedWeatheredCopperGolemStatue = 'minecraft:waxed_weathered_copper_golem_statue'),
    (e.WaxedWeatheredCopperGrate = 'minecraft:waxed_weathered_copper_grate'),
    (e.WaxedWeatheredCopperLantern = 'minecraft:waxed_weathered_copper_lantern'),
    (e.WaxedWeatheredCopperTrapdoor = 'minecraft:waxed_weathered_copper_trapdoor'),
    (e.WaxedWeatheredCutCopper = 'minecraft:waxed_weathered_cut_copper'),
    (e.WaxedWeatheredCutCopperSlab = 'minecraft:waxed_weathered_cut_copper_slab'),
    (e.WaxedWeatheredCutCopperStairs = 'minecraft:waxed_weathered_cut_copper_stairs'),
    (e.WaxedWeatheredLightningRod = 'minecraft:waxed_weathered_lightning_rod'),
    (e.WayfinderArmorTrimSmithingTemplate = 'minecraft:wayfinder_armor_trim_smithing_template'),
    (e.WeatheredChiseledCopper = 'minecraft:weathered_chiseled_copper'),
    (e.WeatheredCopper = 'minecraft:weathered_copper'),
    (e.WeatheredCopperBars = 'minecraft:weathered_copper_bars'),
    (e.WeatheredCopperBulb = 'minecraft:weathered_copper_bulb'),
    (e.WeatheredCopperChain = 'minecraft:weathered_copper_chain'),
    (e.WeatheredCopperChest = 'minecraft:weathered_copper_chest'),
    (e.WeatheredCopperDoor = 'minecraft:weathered_copper_door'),
    (e.WeatheredCopperGolemStatue = 'minecraft:weathered_copper_golem_statue'),
    (e.WeatheredCopperGrate = 'minecraft:weathered_copper_grate'),
    (e.WeatheredCopperLantern = 'minecraft:weathered_copper_lantern'),
    (e.WeatheredCopperTrapdoor = 'minecraft:weathered_copper_trapdoor'),
    (e.WeatheredCutCopper = 'minecraft:weathered_cut_copper'),
    (e.WeatheredCutCopperSlab = 'minecraft:weathered_cut_copper_slab'),
    (e.WeatheredCutCopperStairs = 'minecraft:weathered_cut_copper_stairs'),
    (e.WeatheredLightningRod = 'minecraft:weathered_lightning_rod'),
    (e.Web = 'minecraft:web'),
    (e.WeepingVines = 'minecraft:weeping_vines'),
    (e.WetSponge = 'minecraft:wet_sponge'),
    (e.Wheat = 'minecraft:wheat'),
    (e.WheatSeeds = 'minecraft:wheat_seeds'),
    (e.WhiteBundle = 'minecraft:white_bundle'),
    (e.WhiteCandle = 'minecraft:white_candle'),
    (e.WhiteCarpet = 'minecraft:white_carpet'),
    (e.WhiteConcrete = 'minecraft:white_concrete'),
    (e.WhiteConcretePowder = 'minecraft:white_concrete_powder'),
    (e.WhiteDye = 'minecraft:white_dye'),
    (e.WhiteGlazedTerracotta = 'minecraft:white_glazed_terracotta'),
    (e.WhiteHarness = 'minecraft:white_harness'),
    (e.WhiteShulkerBox = 'minecraft:white_shulker_box'),
    (e.WhiteStainedGlass = 'minecraft:white_stained_glass'),
    (e.WhiteStainedGlassPane = 'minecraft:white_stained_glass_pane'),
    (e.WhiteTerracotta = 'minecraft:white_terracotta'),
    (e.WhiteTulip = 'minecraft:white_tulip'),
    (e.WhiteWool = 'minecraft:white_wool'),
    (e.WildArmorTrimSmithingTemplate = 'minecraft:wild_armor_trim_smithing_template'),
    (e.Wildflowers = 'minecraft:wildflowers'),
    (e.WindCharge = 'minecraft:wind_charge'),
    (e.WitchSpawnEgg = 'minecraft:witch_spawn_egg'),
    (e.WitherRose = 'minecraft:wither_rose'),
    (e.WitherSkeletonSkull = 'minecraft:wither_skeleton_skull'),
    (e.WitherSkeletonSpawnEgg = 'minecraft:wither_skeleton_spawn_egg'),
    (e.WitherSpawnEgg = 'minecraft:wither_spawn_egg'),
    (e.WolfArmor = 'minecraft:wolf_armor'),
    (e.WolfSpawnEgg = 'minecraft:wolf_spawn_egg'),
    (e.WoodenAxe = 'minecraft:wooden_axe'),
    (e.WoodenButton = 'minecraft:wooden_button'),
    (e.WoodenDoor = 'minecraft:wooden_door'),
    (e.WoodenHoe = 'minecraft:wooden_hoe'),
    (e.WoodenPickaxe = 'minecraft:wooden_pickaxe'),
    (e.WoodenPressurePlate = 'minecraft:wooden_pressure_plate'),
    (e.WoodenShovel = 'minecraft:wooden_shovel'),
    (e.WoodenSpear = 'minecraft:wooden_spear'),
    (e.WoodenSword = 'minecraft:wooden_sword'),
    (e.WritableBook = 'minecraft:writable_book'),
    (e.YellowBundle = 'minecraft:yellow_bundle'),
    (e.YellowCandle = 'minecraft:yellow_candle'),
    (e.YellowCarpet = 'minecraft:yellow_carpet'),
    (e.YellowConcrete = 'minecraft:yellow_concrete'),
    (e.YellowConcretePowder = 'minecraft:yellow_concrete_powder'),
    (e.YellowDye = 'minecraft:yellow_dye'),
    (e.YellowGlazedTerracotta = 'minecraft:yellow_glazed_terracotta'),
    (e.YellowHarness = 'minecraft:yellow_harness'),
    (e.YellowShulkerBox = 'minecraft:yellow_shulker_box'),
    (e.YellowStainedGlass = 'minecraft:yellow_stained_glass'),
    (e.YellowStainedGlassPane = 'minecraft:yellow_stained_glass_pane'),
    (e.YellowTerracotta = 'minecraft:yellow_terracotta'),
    (e.YellowWool = 'minecraft:yellow_wool'),
    (e.ZoglinSpawnEgg = 'minecraft:zoglin_spawn_egg'),
    (e.ZombieHead = 'minecraft:zombie_head'),
    (e.ZombieHorseSpawnEgg = 'minecraft:zombie_horse_spawn_egg'),
    (e.ZombieNautilusSpawnEgg = 'minecraft:zombie_nautilus_spawn_egg'),
    (e.ZombiePigmanSpawnEgg = 'minecraft:zombie_pigman_spawn_egg'),
    (e.ZombieSpawnEgg = 'minecraft:zombie_spawn_egg'),
    (e.ZombieVillagerSpawnEgg = 'minecraft:zombie_villager_spawn_egg'),
    e
  ))(E || {}),
  Pu = ((e) => (
    (e.Consume = 'Consume'),
    (e.ThrownLingering = 'ThrownLingering'),
    (e.ThrownSplash = 'ThrownSplash'),
    e
  ))(Pu || {}),
  Eu = ((e) => (
    (e.Awkward = 'minecraft:awkward'),
    (e.FireResistance = 'minecraft:fire_resistance'),
    (e.Harming = 'minecraft:harming'),
    (e.Healing = 'minecraft:healing'),
    (e.Infested = 'minecraft:infested'),
    (e.Invisibility = 'minecraft:invisibility'),
    (e.Leaping = 'minecraft:leaping'),
    (e.LongFireResistance = 'minecraft:long_fire_resistance'),
    (e.LongInvisibility = 'minecraft:long_invisibility'),
    (e.LongLeaping = 'minecraft:long_leaping'),
    (e.LongMundane = 'minecraft:long_mundane'),
    (e.LongNightvision = 'minecraft:long_nightvision'),
    (e.LongPoison = 'minecraft:long_poison'),
    (e.LongRegeneration = 'minecraft:long_regeneration'),
    (e.LongSlowFalling = 'minecraft:long_slow_falling'),
    (e.LongSlowness = 'minecraft:long_slowness'),
    (e.LongStrength = 'minecraft:long_strength'),
    (e.LongSwiftness = 'minecraft:long_swiftness'),
    (e.LongTurtleMaster = 'minecraft:long_turtle_master'),
    (e.LongWaterBreathing = 'minecraft:long_water_breathing'),
    (e.LongWeakness = 'minecraft:long_weakness'),
    (e.Mundane = 'minecraft:mundane'),
    (e.Nightvision = 'minecraft:nightvision'),
    (e.Oozing = 'minecraft:oozing'),
    (e.Poison = 'minecraft:poison'),
    (e.Regeneration = 'minecraft:regeneration'),
    (e.SlowFalling = 'minecraft:slow_falling'),
    (e.Slowness = 'minecraft:slowness'),
    (e.Strength = 'minecraft:strength'),
    (e.StrongHarming = 'minecraft:strong_harming'),
    (e.StrongHealing = 'minecraft:strong_healing'),
    (e.StrongLeaping = 'minecraft:strong_leaping'),
    (e.StrongPoison = 'minecraft:strong_poison'),
    (e.StrongRegeneration = 'minecraft:strong_regeneration'),
    (e.StrongSlowness = 'minecraft:strong_slowness'),
    (e.StrongStrength = 'minecraft:strong_strength'),
    (e.StrongSwiftness = 'minecraft:strong_swiftness'),
    (e.StrongTurtleMaster = 'minecraft:strong_turtle_master'),
    (e.Swiftness = 'minecraft:swiftness'),
    (e.Thick = 'minecraft:thick'),
    (e.TurtleMaster = 'minecraft:turtle_master'),
    (e.Water = 'minecraft:water'),
    (e.WaterBreathing = 'minecraft:water_breathing'),
    (e.Weakness = 'minecraft:weakness'),
    (e.Weaving = 'minecraft:weaving'),
    (e.WindCharged = 'minecraft:wind_charged'),
    (e.Wither = 'minecraft:wither'),
    e
  ))(Eu || {});
var ur = [
  'minecraft:air',
  'minecraft:snow_layer',
  'minecraft:tall_grass',
  'minecraft:double_plant',
  'minecraft:fire',
  'minecraft:soul_fire',
  'minecraft:snow_layer',
  'minecraft:vine',
  'minecraft:seagrass',
  'minecraft:glow_lichen',
  'minecraft:deadbush',
  'minecraft:sculk_vein',
  'minecraft:dandelion',
  'minecraft:wither_rose',
  'minecraft:torchflower',
  'minecraft:pitcher_plant',
  'minecraft:poppy',
  'minecraft:blue_orchid',
  'minecraft:allium',
  'minecraft:azure_bluet',
  'minecraft:red_tulip',
  'minecraft:orange_tulip',
  'minecraft:white_tulip',
  'minecraft:pink_tulip',
  'minecraft:oxeye_daisy',
  'minecraft:cornflower',
  'minecraft:lily_of_the_valley',
  'minecraft:sunflower',
  'minecraft:lilac',
  'minecraft:short_grass',
  'minecraft:rose_bush',
  'minecraft:peony',
  'minecraft:fern',
  'minecraft:large_fern',
  'minecraft:short_dry_grass',
  'minecraft:tall_dry_grass',
  'minecraft:bush',
  'minecraft:nether_sprouts',
];
var Ce = ((l) => (
  (l.BananaPolaroid = 'xp_furniture:banana_polaroid'),
  (l.BarredDoor = 'xp_furniture:barred_door'),
  (l.BedroomPolaroid = 'xp_furniture:bedroom_polaroid'),
  (l.BellPepper = 'xp_furniture:bell_pepper'),
  (l.BellPepperSeed = 'xp_furniture:bell_pepper_seed'),
  (l.BigPlantSpikyItem = 'xp_furniture:big_plant_spiky_item'),
  (l.BlackAcaciaQueenBed = 'xp_furniture:black_acacia_queen_bed'),
  (l.BlackBambooQueenBed = 'xp_furniture:black_bamboo_queen_bed'),
  (l.BlackBirchQueenBed = 'xp_furniture:black_birch_queen_bed'),
  (l.BlackCherryQueenBed = 'xp_furniture:black_cherry_queen_bed'),
  (l.BlackCrimsonQueenBed = 'xp_furniture:black_crimson_queen_bed'),
  (l.BlackCurtainV2 = 'xp_furniture:black_curtain_v2'),
  (l.BlackDarkOakQueenBed = 'xp_furniture:black_dark_oak_queen_bed'),
  (l.BlackDoubleCurtainV2 = 'xp_furniture:black_double_curtain_v2'),
  (l.BlackJungleQueenBed = 'xp_furniture:black_jungle_queen_bed'),
  (l.BlackMangroveQueenBed = 'xp_furniture:black_mangrove_queen_bed'),
  (l.BlackOakQueenBed = 'xp_furniture:black_oak_queen_bed'),
  (l.BlackPaleOakQueenBed = 'xp_furniture:black_pale_oak_queen_bed'),
  (l.BlackRopeFlag = 'xp_furniture:black_rope_flag'),
  (l.BlackSpruceQueenBed = 'xp_furniture:black_spruce_queen_bed'),
  (l.BlackWarpedQueenBed = 'xp_furniture:black_warped_queen_bed'),
  (l.BlazingStarItem = 'xp_furniture:blazing_star_item'),
  (l.BlindsV2 = 'xp_furniture:blinds_v2'),
  (l.BlueAcaciaQueenBed = 'xp_furniture:blue_acacia_queen_bed'),
  (l.BlueBambooQueenBed = 'xp_furniture:blue_bamboo_queen_bed'),
  (l.BlueBirchQueenBed = 'xp_furniture:blue_birch_queen_bed'),
  (l.BlueCherryQueenBed = 'xp_furniture:blue_cherry_queen_bed'),
  (l.BlueCrimsonQueenBed = 'xp_furniture:blue_crimson_queen_bed'),
  (l.BlueCurtainV2 = 'xp_furniture:blue_curtain_v2'),
  (l.BlueDarkOakQueenBed = 'xp_furniture:blue_dark_oak_queen_bed'),
  (l.BlueDoubleCurtainV2 = 'xp_furniture:blue_double_curtain_v2'),
  (l.BlueJungleQueenBed = 'xp_furniture:blue_jungle_queen_bed'),
  (l.BlueMangroveQueenBed = 'xp_furniture:blue_mangrove_queen_bed'),
  (l.BlueOakQueenBed = 'xp_furniture:blue_oak_queen_bed'),
  (l.BluePaleOakQueenBed = 'xp_furniture:blue_pale_oak_queen_bed'),
  (l.BlueRopeFlag = 'xp_furniture:blue_rope_flag'),
  (l.BlueSpruceQueenBed = 'xp_furniture:blue_spruce_queen_bed'),
  (l.BlueWarpedQueenBed = 'xp_furniture:blue_warped_queen_bed'),
  (l.Bongos = 'xp_furniture:bongos'),
  (l.BrownAcaciaQueenBed = 'xp_furniture:brown_acacia_queen_bed'),
  (l.BrownBambooQueenBed = 'xp_furniture:brown_bamboo_queen_bed'),
  (l.BrownBirchQueenBed = 'xp_furniture:brown_birch_queen_bed'),
  (l.BrownCherryQueenBed = 'xp_furniture:brown_cherry_queen_bed'),
  (l.BrownCrimsonQueenBed = 'xp_furniture:brown_crimson_queen_bed'),
  (l.BrownCurtainV2 = 'xp_furniture:brown_curtain_v2'),
  (l.BrownDarkOakQueenBed = 'xp_furniture:brown_dark_oak_queen_bed'),
  (l.BrownDoubleCurtainV2 = 'xp_furniture:brown_double_curtain_v2'),
  (l.BrownJungleQueenBed = 'xp_furniture:brown_jungle_queen_bed'),
  (l.BrownMangroveQueenBed = 'xp_furniture:brown_mangrove_queen_bed'),
  (l.BrownOakQueenBed = 'xp_furniture:brown_oak_queen_bed'),
  (l.BrownPaleOakQueenBed = 'xp_furniture:brown_pale_oak_queen_bed'),
  (l.BrownRopeFlag = 'xp_furniture:brown_rope_flag'),
  (l.BrownSpruceQueenBed = 'xp_furniture:brown_spruce_queen_bed'),
  (l.BrownWarpedQueenBed = 'xp_furniture:brown_warped_queen_bed'),
  (l.BugsNet = 'xp_furniture:bugs_net'),
  (l.Bush = 'xp_furniture:bush'),
  (l.ButterflowerClusterItem = 'xp_furniture:butterflower_cluster_item'),
  (l.ButterflyMilkweedItem = 'xp_furniture:butterfly_milkweed_item'),
  (l.ButterflyMonarch = 'xp_furniture:butterfly_monarch'),
  (l.ButterflyMorpho = 'xp_furniture:butterfly_morpho'),
  (l.ButterflyPeacock = 'xp_furniture:butterfly_peacock'),
  (l.ButterflyPhoebus = 'xp_furniture:butterfly_phoebus'),
  (l.ButterflySwallowtail = 'xp_furniture:butterfly_swallowtail'),
  (l.Cabbage = 'xp_furniture:cabbage'),
  (l.CabbageSeed = 'xp_furniture:cabbage_seed'),
  (l.CapybaraPolaroid = 'xp_furniture:capybara_polaroid'),
  (l.CatPolaroid = 'xp_furniture:cat_polaroid'),
  (l.Cattail = 'xp_furniture:cattail'),
  (l.Chilipepper = 'xp_furniture:chilipepper'),
  (l.ChristmasTreeItem = 'xp_furniture:christmas_tree_item'),
  (l.ChristmasTreePolaroid = 'xp_furniture:christmas_tree_polaroid'),
  (l.CloverCluster = 'xp_furniture:clover_cluster'),
  (l.CloverWeedsItem = 'xp_furniture:clover_weeds_item'),
  (l.CookingPan = 'xp_furniture:cooking_pan'),
  (l.Corn = 'xp_furniture:corn'),
  (l.CornSeed = 'xp_furniture:corn_seed'),
  (l.CrunchPolaroid = 'xp_furniture:crunch_polaroid'),
  (l.CyanAcaciaQueenBed = 'xp_furniture:cyan_acacia_queen_bed'),
  (l.CyanBambooQueenBed = 'xp_furniture:cyan_bamboo_queen_bed'),
  (l.CyanBirchQueenBed = 'xp_furniture:cyan_birch_queen_bed'),
  (l.CyanCherryQueenBed = 'xp_furniture:cyan_cherry_queen_bed'),
  (l.CyanCrimsonQueenBed = 'xp_furniture:cyan_crimson_queen_bed'),
  (l.CyanCurtainV2 = 'xp_furniture:cyan_curtain_v2'),
  (l.CyanDarkOakQueenBed = 'xp_furniture:cyan_dark_oak_queen_bed'),
  (l.CyanDoubleCurtainV2 = 'xp_furniture:cyan_double_curtain_v2'),
  (l.CyanJungleQueenBed = 'xp_furniture:cyan_jungle_queen_bed'),
  (l.CyanMangroveQueenBed = 'xp_furniture:cyan_mangrove_queen_bed'),
  (l.CyanOakQueenBed = 'xp_furniture:cyan_oak_queen_bed'),
  (l.CyanPaleOakQueenBed = 'xp_furniture:cyan_pale_oak_queen_bed'),
  (l.CyanRopeFlag = 'xp_furniture:cyan_rope_flag'),
  (l.CyanSpruceQueenBed = 'xp_furniture:cyan_spruce_queen_bed'),
  (l.CyanWarpedQueenBed = 'xp_furniture:cyan_warped_queen_bed'),
  (l.DesertPolaroid = 'xp_furniture:desert_polaroid'),
  (l.DogwoodSapling = 'xp_furniture:dogwood_sapling'),
  (l.DoubleBlindsV2 = 'xp_furniture:double_blinds_v2'),
  (l.DuckweedItem = 'xp_furniture:duckweed_item'),
  (l.Eggplant = 'xp_furniture:eggplant'),
  (l.EggplantSeed = 'xp_furniture:eggplant_seed'),
  (l.FlowerCluster0Item = 'xp_furniture:flower_cluster_0_item'),
  (l.FlowerCluster1Item = 'xp_furniture:flower_cluster_1_item'),
  (l.FlowerCluster2Item = 'xp_furniture:flower_cluster_2_item'),
  (l.FlowerCluster3Item = 'xp_furniture:flower_cluster_3_item'),
  (l.Foxglove = 'xp_furniture:foxglove'),
  (l.GoldenChainLeavesHanging = 'xp_furniture:golden_chain_leaves_hanging'),
  (l.GoldenChainSapling = 'xp_furniture:golden_chain_sapling'),
  (l.GrassWeedsItem = 'xp_furniture:grass_weeds_item'),
  (l.GrayAcaciaQueenBed = 'xp_furniture:gray_acacia_queen_bed'),
  (l.GrayBambooQueenBed = 'xp_furniture:gray_bamboo_queen_bed'),
  (l.GrayBirchQueenBed = 'xp_furniture:gray_birch_queen_bed'),
  (l.GrayCherryQueenBed = 'xp_furniture:gray_cherry_queen_bed'),
  (l.GrayCrimsonQueenBed = 'xp_furniture:gray_crimson_queen_bed'),
  (l.GrayCurtainV2 = 'xp_furniture:gray_curtain_v2'),
  (l.GrayDarkOakQueenBed = 'xp_furniture:gray_dark_oak_queen_bed'),
  (l.GrayDoubleCurtainV2 = 'xp_furniture:gray_double_curtain_v2'),
  (l.GrayJungleQueenBed = 'xp_furniture:gray_jungle_queen_bed'),
  (l.GrayMangroveQueenBed = 'xp_furniture:gray_mangrove_queen_bed'),
  (l.GrayOakQueenBed = 'xp_furniture:gray_oak_queen_bed'),
  (l.GrayPaleOakQueenBed = 'xp_furniture:gray_pale_oak_queen_bed'),
  (l.GrayRopeFlag = 'xp_furniture:gray_rope_flag'),
  (l.GraySpruceQueenBed = 'xp_furniture:gray_spruce_queen_bed'),
  (l.GrayWarpedQueenBed = 'xp_furniture:gray_warped_queen_bed'),
  (l.GreenAcaciaQueenBed = 'xp_furniture:green_acacia_queen_bed'),
  (l.GreenBambooQueenBed = 'xp_furniture:green_bamboo_queen_bed'),
  (l.GreenBirchQueenBed = 'xp_furniture:green_birch_queen_bed'),
  (l.GreenCherryQueenBed = 'xp_furniture:green_cherry_queen_bed'),
  (l.GreenCrimsonQueenBed = 'xp_furniture:green_crimson_queen_bed'),
  (l.GreenCurtainV2 = 'xp_furniture:green_curtain_v2'),
  (l.GreenDarkOakQueenBed = 'xp_furniture:green_dark_oak_queen_bed'),
  (l.GreenDoubleCurtainV2 = 'xp_furniture:green_double_curtain_v2'),
  (l.GreenJungleQueenBed = 'xp_furniture:green_jungle_queen_bed'),
  (l.GreenMangroveQueenBed = 'xp_furniture:green_mangrove_queen_bed'),
  (l.GreenOakQueenBed = 'xp_furniture:green_oak_queen_bed'),
  (l.GreenPaleOakQueenBed = 'xp_furniture:green_pale_oak_queen_bed'),
  (l.GreenRopeFlag = 'xp_furniture:green_rope_flag'),
  (l.GreenSpruceQueenBed = 'xp_furniture:green_spruce_queen_bed'),
  (l.GreenWarpedQueenBed = 'xp_furniture:green_warped_queen_bed'),
  (l.GrilledCorn = 'xp_furniture:grilled_corn'),
  (l.GrilledEggplant = 'xp_furniture:grilled_eggplant'),
  (l.GuideBook = 'xp_furniture:guide_book'),
  (l.Hammer = 'xp_furniture:hammer'),
  (l.HangingGoldenChainLeavesItem = 'xp_furniture:hanging_golden_chain_leaves_item'),
  (l.HangingGoldenChainVinesItem = 'xp_furniture:hanging_golden_chain_vines_item'),
  (l.HangingWillowLeavesItem = 'xp_furniture:hanging_willow_leaves_item'),
  (l.HangingWillowVinesItem = 'xp_furniture:hanging_willow_vines_item'),
  (l.HangingWisteriaLeavesItem = 'xp_furniture:hanging_wisteria_leaves_item'),
  (l.HangingWisteriaVinesItem = 'xp_furniture:hanging_wisteria_vines_item'),
  (l.Harp = 'xp_furniture:harp'),
  (l.HousePolaroid = 'xp_furniture:house_polaroid'),
  (l.IcicleItem = 'xp_furniture:icicle_item'),
  (l.IvyItem = 'xp_furniture:ivy_item'),
  (l.LeafPile = 'xp_furniture:leaf_pile'),
  (l.LightBlueAcaciaQueenBed = 'xp_furniture:light_blue_acacia_queen_bed'),
  (l.LightBlueBambooQueenBed = 'xp_furniture:light_blue_bamboo_queen_bed'),
  (l.LightBlueBirchQueenBed = 'xp_furniture:light_blue_birch_queen_bed'),
  (l.LightBlueCherryQueenBed = 'xp_furniture:light_blue_cherry_queen_bed'),
  (l.LightBlueCrimsonQueenBed = 'xp_furniture:light_blue_crimson_queen_bed'),
  (l.LightBlueCurtainV2 = 'xp_furniture:light_blue_curtain_v2'),
  (l.LightBlueDarkOakQueenBed = 'xp_furniture:light_blue_dark_oak_queen_bed'),
  (l.LightBlueDoubleCurtainV2 = 'xp_furniture:light_blue_double_curtain_v2'),
  (l.LightBlueJungleQueenBed = 'xp_furniture:light_blue_jungle_queen_bed'),
  (l.LightBlueMangroveQueenBed = 'xp_furniture:light_blue_mangrove_queen_bed'),
  (l.LightBlueOakQueenBed = 'xp_furniture:light_blue_oak_queen_bed'),
  (l.LightBluePaleOakQueenBed = 'xp_furniture:light_blue_pale_oak_queen_bed'),
  (l.LightBlueRopeFlag = 'xp_furniture:light_blue_rope_flag'),
  (l.LightBlueSpruceQueenBed = 'xp_furniture:light_blue_spruce_queen_bed'),
  (l.LightBlueWarpedQueenBed = 'xp_furniture:light_blue_warped_queen_bed'),
  (l.LightGrayAcaciaQueenBed = 'xp_furniture:light_gray_acacia_queen_bed'),
  (l.LightGrayBambooQueenBed = 'xp_furniture:light_gray_bamboo_queen_bed'),
  (l.LightGrayBirchQueenBed = 'xp_furniture:light_gray_birch_queen_bed'),
  (l.LightGrayCherryQueenBed = 'xp_furniture:light_gray_cherry_queen_bed'),
  (l.LightGrayCrimsonQueenBed = 'xp_furniture:light_gray_crimson_queen_bed'),
  (l.LightGrayCurtainV2 = 'xp_furniture:light_gray_curtain_v2'),
  (l.LightGrayDarkOakQueenBed = 'xp_furniture:light_gray_dark_oak_queen_bed'),
  (l.LightGrayDoubleCurtainV2 = 'xp_furniture:light_gray_double_curtain_v2'),
  (l.LightGrayJungleQueenBed = 'xp_furniture:light_gray_jungle_queen_bed'),
  (l.LightGrayMangroveQueenBed = 'xp_furniture:light_gray_mangrove_queen_bed'),
  (l.LightGrayOakQueenBed = 'xp_furniture:light_gray_oak_queen_bed'),
  (l.LightGrayPaleOakQueenBed = 'xp_furniture:light_gray_pale_oak_queen_bed'),
  (l.LightGrayRopeFlag = 'xp_furniture:light_gray_rope_flag'),
  (l.LightGraySpruceQueenBed = 'xp_furniture:light_gray_spruce_queen_bed'),
  (l.LightGrayWarpedQueenBed = 'xp_furniture:light_gray_warped_queen_bed'),
  (l.LimeAcaciaQueenBed = 'xp_furniture:lime_acacia_queen_bed'),
  (l.LimeBambooQueenBed = 'xp_furniture:lime_bamboo_queen_bed'),
  (l.LimeBirchQueenBed = 'xp_furniture:lime_birch_queen_bed'),
  (l.LimeCherryQueenBed = 'xp_furniture:lime_cherry_queen_bed'),
  (l.LimeCrimsonQueenBed = 'xp_furniture:lime_crimson_queen_bed'),
  (l.LimeCurtainV2 = 'xp_furniture:lime_curtain_v2'),
  (l.LimeDarkOakQueenBed = 'xp_furniture:lime_dark_oak_queen_bed'),
  (l.LimeDoubleCurtainV2 = 'xp_furniture:lime_double_curtain_v2'),
  (l.LimeJungleQueenBed = 'xp_furniture:lime_jungle_queen_bed'),
  (l.LimeMangroveQueenBed = 'xp_furniture:lime_mangrove_queen_bed'),
  (l.LimeOakQueenBed = 'xp_furniture:lime_oak_queen_bed'),
  (l.LimePaleOakQueenBed = 'xp_furniture:lime_pale_oak_queen_bed'),
  (l.LimeRopeFlag = 'xp_furniture:lime_rope_flag'),
  (l.LimeSpruceQueenBed = 'xp_furniture:lime_spruce_queen_bed'),
  (l.LimeWarpedQueenBed = 'xp_furniture:lime_warped_queen_bed'),
  (l.LotusLilypadPinkItem = 'xp_furniture:lotus_lilypad_pink_item'),
  (l.LotusLilypadPurpleItem = 'xp_furniture:lotus_lilypad_purple_item'),
  (l.LotusLilypadWhiteItem = 'xp_furniture:lotus_lilypad_white_item'),
  (l.MagentaAcaciaQueenBed = 'xp_furniture:magenta_acacia_queen_bed'),
  (l.MagentaBambooQueenBed = 'xp_furniture:magenta_bamboo_queen_bed'),
  (l.MagentaBirchQueenBed = 'xp_furniture:magenta_birch_queen_bed'),
  (l.MagentaCherryQueenBed = 'xp_furniture:magenta_cherry_queen_bed'),
  (l.MagentaCrimsonQueenBed = 'xp_furniture:magenta_crimson_queen_bed'),
  (l.MagentaCurtainV2 = 'xp_furniture:magenta_curtain_v2'),
  (l.MagentaDarkOakQueenBed = 'xp_furniture:magenta_dark_oak_queen_bed'),
  (l.MagentaDoubleCurtainV2 = 'xp_furniture:magenta_double_curtain_v2'),
  (l.MagentaJungleQueenBed = 'xp_furniture:magenta_jungle_queen_bed'),
  (l.MagentaMangroveQueenBed = 'xp_furniture:magenta_mangrove_queen_bed'),
  (l.MagentaOakQueenBed = 'xp_furniture:magenta_oak_queen_bed'),
  (l.MagentaPaleOakQueenBed = 'xp_furniture:magenta_pale_oak_queen_bed'),
  (l.MagentaRopeFlag = 'xp_furniture:magenta_rope_flag'),
  (l.MagentaSpruceQueenBed = 'xp_furniture:magenta_spruce_queen_bed'),
  (l.MagentaWarpedQueenBed = 'xp_furniture:magenta_warped_queen_bed'),
  (l.MaidenhairFernItem = 'xp_furniture:maidenhair_fern_item'),
  (l.MonsteraItem = 'xp_furniture:monstera_item'),
  (l.MoonPolaroid = 'xp_furniture:moon_polaroid'),
  (l.MossyPebblesItem = 'xp_furniture:mossy_pebbles_item'),
  (l.MothMaple = 'xp_furniture:moth_maple'),
  (l.MothSatin = 'xp_furniture:moth_satin'),
  (l.MountainPolaroid = 'xp_furniture:mountain_polaroid'),
  (l.MushroomClusterItem = 'xp_furniture:mushroom_cluster_item'),
  (l.OrangeAcaciaQueenBed = 'xp_furniture:orange_acacia_queen_bed'),
  (l.OrangeAcaciaSapling = 'xp_furniture:orange_acacia_sapling'),
  (l.OrangeBambooQueenBed = 'xp_furniture:orange_bamboo_queen_bed'),
  (l.OrangeBirchQueenBed = 'xp_furniture:orange_birch_queen_bed'),
  (l.OrangeCherryQueenBed = 'xp_furniture:orange_cherry_queen_bed'),
  (l.OrangeCrimsonQueenBed = 'xp_furniture:orange_crimson_queen_bed'),
  (l.OrangeCurtainV2 = 'xp_furniture:orange_curtain_v2'),
  (l.OrangeDarkOakQueenBed = 'xp_furniture:orange_dark_oak_queen_bed'),
  (l.OrangeDoubleCurtainV2 = 'xp_furniture:orange_double_curtain_v2'),
  (l.OrangeJungleQueenBed = 'xp_furniture:orange_jungle_queen_bed'),
  (l.OrangeMangroveQueenBed = 'xp_furniture:orange_mangrove_queen_bed'),
  (l.OrangeOakQueenBed = 'xp_furniture:orange_oak_queen_bed'),
  (l.OrangePaleOakQueenBed = 'xp_furniture:orange_pale_oak_queen_bed'),
  (l.OrangeRopeFlag = 'xp_furniture:orange_rope_flag'),
  (l.OrangeSpruceQueenBed = 'xp_furniture:orange_spruce_queen_bed'),
  (l.OrangeWarpedQueenBed = 'xp_furniture:orange_warped_queen_bed'),
  (l.Panflute = 'xp_furniture:panflute'),
  (l.PebblesItem = 'xp_furniture:pebbles_item'),
  (l.PhilodendronItem = 'xp_furniture:philodendron_item'),
  (l.Piano = 'xp_furniture:piano'),
  (l.PianoFancy = 'xp_furniture:piano_fancy'),
  (l.PinkAcaciaQueenBed = 'xp_furniture:pink_acacia_queen_bed'),
  (l.PinkBambooQueenBed = 'xp_furniture:pink_bamboo_queen_bed'),
  (l.PinkBirchQueenBed = 'xp_furniture:pink_birch_queen_bed'),
  (l.PinkCherryQueenBed = 'xp_furniture:pink_cherry_queen_bed'),
  (l.PinkCrimsonQueenBed = 'xp_furniture:pink_crimson_queen_bed'),
  (l.PinkCurtainV2 = 'xp_furniture:pink_curtain_v2'),
  (l.PinkDarkOakQueenBed = 'xp_furniture:pink_dark_oak_queen_bed'),
  (l.PinkDoubleCurtainV2 = 'xp_furniture:pink_double_curtain_v2'),
  (l.PinkJungleQueenBed = 'xp_furniture:pink_jungle_queen_bed'),
  (l.PinkMangroveQueenBed = 'xp_furniture:pink_mangrove_queen_bed'),
  (l.PinkOakQueenBed = 'xp_furniture:pink_oak_queen_bed'),
  (l.PinkPaleOakQueenBed = 'xp_furniture:pink_pale_oak_queen_bed'),
  (l.PinkRopeFlag = 'xp_furniture:pink_rope_flag'),
  (l.PinkSpruceQueenBed = 'xp_furniture:pink_spruce_queen_bed'),
  (l.PinkWarpedQueenBed = 'xp_furniture:pink_warped_queen_bed'),
  (l.PumpkinPieSlice = 'xp_furniture:pumpkin_pie_slice'),
  (l.PumpkinPolaroid = 'xp_furniture:pumpkin_polaroid'),
  (l.PurpleAcaciaQueenBed = 'xp_furniture:purple_acacia_queen_bed'),
  (l.PurpleBambooQueenBed = 'xp_furniture:purple_bamboo_queen_bed'),
  (l.PurpleBirchQueenBed = 'xp_furniture:purple_birch_queen_bed'),
  (l.PurpleCherryQueenBed = 'xp_furniture:purple_cherry_queen_bed'),
  (l.PurpleCrimsonQueenBed = 'xp_furniture:purple_crimson_queen_bed'),
  (l.PurpleCurtainV2 = 'xp_furniture:purple_curtain_v2'),
  (l.PurpleDarkOakQueenBed = 'xp_furniture:purple_dark_oak_queen_bed'),
  (l.PurpleDoubleCurtainV2 = 'xp_furniture:purple_double_curtain_v2'),
  (l.PurpleJungleQueenBed = 'xp_furniture:purple_jungle_queen_bed'),
  (l.PurpleMangroveQueenBed = 'xp_furniture:purple_mangrove_queen_bed'),
  (l.PurpleOakQueenBed = 'xp_furniture:purple_oak_queen_bed'),
  (l.PurplePaleOakQueenBed = 'xp_furniture:purple_pale_oak_queen_bed'),
  (l.PurpleRopeFlag = 'xp_furniture:purple_rope_flag'),
  (l.PurpleSpruceQueenBed = 'xp_furniture:purple_spruce_queen_bed'),
  (l.PurpleWarpedQueenBed = 'xp_furniture:purple_warped_queen_bed'),
  (l.RedAcaciaQueenBed = 'xp_furniture:red_acacia_queen_bed'),
  (l.RedBambooQueenBed = 'xp_furniture:red_bamboo_queen_bed'),
  (l.RedBirchQueenBed = 'xp_furniture:red_birch_queen_bed'),
  (l.RedCherryQueenBed = 'xp_furniture:red_cherry_queen_bed'),
  (l.RedCrimsonQueenBed = 'xp_furniture:red_crimson_queen_bed'),
  (l.RedCurtainV2 = 'xp_furniture:red_curtain_v2'),
  (l.RedDarkOakQueenBed = 'xp_furniture:red_dark_oak_queen_bed'),
  (l.RedDoubleCurtainV2 = 'xp_furniture:red_double_curtain_v2'),
  (l.RedJungleQueenBed = 'xp_furniture:red_jungle_queen_bed'),
  (l.RedMangroveQueenBed = 'xp_furniture:red_mangrove_queen_bed'),
  (l.RedOakQueenBed = 'xp_furniture:red_oak_queen_bed'),
  (l.RedPaleOakQueenBed = 'xp_furniture:red_pale_oak_queen_bed'),
  (l.RedRopeFlag = 'xp_furniture:red_rope_flag'),
  (l.RedSpruceQueenBed = 'xp_furniture:red_spruce_queen_bed'),
  (l.RedWarpedQueenBed = 'xp_furniture:red_warped_queen_bed'),
  (l.ReindeerPolaroid = 'xp_furniture:reindeer_polaroid'),
  (l.Rope = 'xp_furniture:rope'),
  (l.RopeMistletoeHanging = 'xp_furniture:rope_mistletoe.hanging'),
  (l.RopeSock0 = 'xp_furniture:rope_sock_0'),
  (l.RopeSock1 = 'xp_furniture:rope_sock_1'),
  (l.RopeSock2 = 'xp_furniture:rope_sock_2'),
  (l.RopeSock3 = 'xp_furniture:rope_sock_3'),
  (l.RopeSock4 = 'xp_furniture:rope_sock_4'),
  (l.Salad = 'xp_furniture:salad'),
  (l.ShelfFungus = 'xp_furniture:shelf_fungus'),
  (l.SightingPolaroid = 'xp_furniture:sighting_polaroid'),
  (l.SmallClusterLilyPadItem = 'xp_furniture:small_cluster_lily_pad_item'),
  (l.SmallWeedsClusterItem = 'xp_furniture:small_weeds_cluster_item'),
  (l.SnowmanPolaroid = 'xp_furniture:snowman_polaroid'),
  (l.SpikeWeeds = 'xp_furniture:spike_weeds'),
  (l.SucculentItem = 'xp_furniture:succulent_item'),
  (l.SunsetPolaroid = 'xp_furniture:sunset_polaroid'),
  (l.SwordFernItem = 'xp_furniture:sword_fern_item'),
  (l.Tomato = 'xp_furniture:tomato'),
  (l.TomatoSeed = 'xp_furniture:tomato_seed'),
  (l.TunnelPolaroid = 'xp_furniture:tunnel_polaroid'),
  (l.Ukulele = 'xp_furniture:ukulele'),
  (l.WateringCan = 'xp_furniture:watering_can'),
  (l.WateringCanEmpty = 'xp_furniture:watering_can_empty'),
  (l.WeedsClusterItem = 'xp_furniture:weeds_cluster_item'),
  (l.WhiteAcaciaQueenBed = 'xp_furniture:white_acacia_queen_bed'),
  (l.WhiteBambooQueenBed = 'xp_furniture:white_bamboo_queen_bed'),
  (l.WhiteBirchQueenBed = 'xp_furniture:white_birch_queen_bed'),
  (l.WhiteCherryQueenBed = 'xp_furniture:white_cherry_queen_bed'),
  (l.WhiteCrimsonQueenBed = 'xp_furniture:white_crimson_queen_bed'),
  (l.WhiteCurtainV2 = 'xp_furniture:white_curtain_v2'),
  (l.WhiteDarkOakQueenBed = 'xp_furniture:white_dark_oak_queen_bed'),
  (l.WhiteDoubleCurtainV2 = 'xp_furniture:white_double_curtain_v2'),
  (l.WhiteJungleQueenBed = 'xp_furniture:white_jungle_queen_bed'),
  (l.WhiteMangroveQueenBed = 'xp_furniture:white_mangrove_queen_bed'),
  (l.WhiteOakQueenBed = 'xp_furniture:white_oak_queen_bed'),
  (l.WhitePaleOakQueenBed = 'xp_furniture:white_pale_oak_queen_bed'),
  (l.WhiteRopeFlag = 'xp_furniture:white_rope_flag'),
  (l.WhiteSpruceQueenBed = 'xp_furniture:white_spruce_queen_bed'),
  (l.WhiteWarpedQueenBed = 'xp_furniture:white_warped_queen_bed'),
  (l.WillowLeavesHanging = 'xp_furniture:willow_leaves_hanging'),
  (l.WillowSapling = 'xp_furniture:willow_sapling'),
  (l.WisteriaLeavesHanging = 'xp_furniture:wisteria_leaves_hanging'),
  (l.WisteriaSapling = 'xp_furniture:wisteria_sapling'),
  (l.WoodMugDrink = 'xp_furniture:wood_mug_drink'),
  (l.WoodMugDrinkCocoa = 'xp_furniture:wood_mug_drink_cocoa'),
  (l.WoodMugDrinkFull = 'xp_furniture:wood_mug_drink_full'),
  (l.YellowAcaciaQueenBed = 'xp_furniture:yellow_acacia_queen_bed'),
  (l.YellowBambooQueenBed = 'xp_furniture:yellow_bamboo_queen_bed'),
  (l.YellowBirchQueenBed = 'xp_furniture:yellow_birch_queen_bed'),
  (l.YellowBirchSapling = 'xp_furniture:yellow_birch_sapling'),
  (l.YellowCherryQueenBed = 'xp_furniture:yellow_cherry_queen_bed'),
  (l.YellowCrimsonQueenBed = 'xp_furniture:yellow_crimson_queen_bed'),
  (l.YellowCurtainV2 = 'xp_furniture:yellow_curtain_v2'),
  (l.YellowDarkOakQueenBed = 'xp_furniture:yellow_dark_oak_queen_bed'),
  (l.YellowDoubleCurtainV2 = 'xp_furniture:yellow_double_curtain_v2'),
  (l.YellowJungleQueenBed = 'xp_furniture:yellow_jungle_queen_bed'),
  (l.YellowMangroveQueenBed = 'xp_furniture:yellow_mangrove_queen_bed'),
  (l.YellowOakQueenBed = 'xp_furniture:yellow_oak_queen_bed'),
  (l.YellowPaleOakQueenBed = 'xp_furniture:yellow_pale_oak_queen_bed'),
  (l.YellowRopeFlag = 'xp_furniture:yellow_rope_flag'),
  (l.YellowSpruceQueenBed = 'xp_furniture:yellow_spruce_queen_bed'),
  (l.YellowWarpedQueenBed = 'xp_furniture:yellow_warped_queen_bed'),
  l
))(Ce || {});
import {
  EntityEquippableComponent as Bu,
  EntityInventoryComponent as Au,
  world as li,
} from '@minecraft/server';
import { world as ei } from '@minecraft/server';
var Kr = h.getLogger('FurniturePack', 'EventDecorators'),
  Rn = {
    afterEvents: {
      playerPlaceBlock: [],
      playerBreakBlock: [],
      playerInteractWithBlock: [],
      playerInteractWithEntity: [],
      playerLeave: [],
      playerJoin: [],
      playerSpawn: [],
      entityDie: [],
      entityHurt: [],
      entityHitEntity: [],
      entityHitBlock: [],
      entityLoad: [],
      entityRemove: [],
      entitySpawn: [],
      explosion: [],
      itemUse: [],
      itemStartUse: [],
      itemStopUse: [],
      itemCompleteUse: [],
      itemReleaseUse: [],
      itemStartUseOn: [],
      itemStopUseOn: [],
      blockExplode: [],
      buttonPush: [],
      leverAction: [],
      pistonActivate: [],
      pressurePlatePop: [],
      pressurePlatePush: [],
      projectileHitBlock: [],
      projectileHitEntity: [],
      targetBlockHit: [],
      tripWireTrip: [],
      weatherChange: [],
      effectAdd: [],
      playerGameModeChange: [],
    },
    beforeEvents: {
      playerInteractWithBlock: [],
      playerInteractWithEntity: [],
      playerLeave: [],
      itemUse: [],
      entityRemove: [],
      explosion: [],
      weatherChange: [],
      effectAdd: [],
      playerBreakBlock: [],
      playerGameModeChange: [],
    },
  };
function ye(e, r) {
  return function (t, n, o) {
    let a = o.value.bind(t);
    (Rn[e][r].push(a), Kr.debug(`Registered ${e}.${r} handler: ${t.name}.${n}`));
  };
}
function Ge(e, r, t) {
  return ye('afterEvents', 'playerPlaceBlock')(e, r, t);
}
function _r(e, r, t) {
  return ye('afterEvents', 'playerBreakBlock')(e, r, t);
}
function ri(e, r, t) {
  return ye('afterEvents', 'playerInteractWithBlock')(e, r, t);
}
function ti(e, r, t) {
  return ye('afterEvents', 'playerInteractWithEntity')(e, r, t);
}
function Tt(e, r, t) {
  return ye('afterEvents', 'playerSpawn')(e, r, t);
}
function Et(e, r, t) {
  return ye('afterEvents', 'entityHitEntity')(e, r, t);
}
function ni(e, r, t) {
  return ye('afterEvents', 'entityHitBlock')(e, r, t);
}
function Zr(e, r, t) {
  return ye('afterEvents', 'entityLoad')(e, r, t);
}
function oi(e, r, t) {
  return ye('afterEvents', 'entitySpawn')(e, r, t);
}
function Mt(e, r, t) {
  return ye('beforeEvents', 'playerInteractWithBlock')(e, r, t);
}
function ii(e, r, t) {
  return ye('beforeEvents', 'playerLeave')(e, r, t);
}
function ai(e, r, t) {
  return ye('beforeEvents', 'entityRemove')(e, r, t);
}
function ui(e, r, t) {
  return ye('beforeEvents', 'effectAdd')(e, r, t);
}
function _i() {
  for (let [e, r] of Object.entries(Rn.afterEvents))
    r.length > 0 &&
      (ei.afterEvents[e].subscribe((t) => {
        for (let n of r)
          try {
            n(t);
          } catch (o) {
            Kr.error(`Error in afterEvents.${e} handler: ${o}`);
          }
      }),
      Kr.info(`Subscribed ${r.length} handler(s) to afterEvents.${e}`));
  for (let [e, r] of Object.entries(Rn.beforeEvents))
    r.length > 0 &&
      (ei.beforeEvents[e].subscribe((t) => {
        for (let n of r)
          try {
            n(t);
          } catch (o) {
            Kr.error(`Error in beforeEvents.${e} handler: ${o}`);
          }
      }),
      Kr.info(`Subscribed ${r.length} handler(s) to beforeEvents.${e}`));
  Kr.info('All event subscriptions initialized.');
}
var si = h.getLogger('FurniturePack', 'Utilities', 'Player'),
  y = class {
    static getInventoryComponent(r) {
      if (this.inventoryComponent.has(r.id)) return this.inventoryComponent.get(r.id);
      let t = r.getComponent(Au.componentId);
      if (!t) {
        si.error(`Player ${r.name} does not have an inventory component.`);
        return;
      }
      return (this.inventoryComponent.set(r.id, t), t);
    }
    static getEquippableComponent(r) {
      if (this.equippableComponent.has(r.id)) return this.equippableComponent.get(r.id);
      let t = r.getComponent(Bu.componentId);
      if (!t) {
        si.error(`Player ${r.name} does not have an equippable component.`);
        return;
      }
      return (this.equippableComponent.set(r.id, t), t);
    }
    static getPlayerCardinalDirection(r) {
      let t = r.getRotation().y;
      return t > 135 || t <= -135 ? 2 : t > -135 && t <= -45 ? 3 : t > -45 && t <= 45 ? 0 : 1;
    }
    static getAllPlayers() {
      return li.getAllPlayers();
    }
    static onWorldLoad() {
      (this.inventoryComponent.clear(), this.equippableComponent.clear());
    }
    static onPlayerJoin(r) {
      let { player: t } = r;
      (this.inventoryComponent.delete(t.id), this.equippableComponent.delete(t.id));
    }
    static onPlayerLeave(r) {
      let t = r.player.id;
      (this.inventoryComponent.delete(t), this.equippableComponent.delete(t));
    }
  };
((y.inventoryComponent = new Map()),
  (y.equippableComponent = new Map()),
  d([ue], y, 'onWorldLoad', 1),
  d([Tt], y, 'onPlayerJoin', 1),
  d([ii], y, 'onPlayerLeave', 1));
var U = class {
  static isMultiblock(r) {
    let t = r.permutation.getAllStates(),
      n = [
        'xp_furniture:bed_piece',
        'xp_furniture:width_piece',
        'xp_furniture:table_piece_bit',
        'xp_furniture:top_piece_bit',
        'xp_furniture:head_piece_bit',
        'xp_furniture:multiblock_part',
      ],
      o = !1;
    for (let i of n)
      if (i in t) {
        o = !0;
        break;
      }
    return o;
  }
  beforeOnPlayerPlace(r, t) {
    U.handlePlacement(r, t);
  }
  static handlePlacement(r, t, n = !1) {
    let o = h.getLogger('MultiblockComponent'),
      i = U.validate(t.params);
    if (!i) return;
    let a = r.permutationToPlace,
      u = a.getAllStates(),
      _ = U.toDirection(u['minecraft:cardinal_direction']);
    if (!_ && i.rotate) {
      o.error(a.type.id, 'Invalid placement direction state:', u['minecraft:cardinal_direction']);
      return;
    }
    let s = r.block.dimension,
      c = f.from(r.block.location),
      p = U.getPlacementBlocks(s, c, i.size, _);
    if (!n && !U.isPlaceable(p)) {
      (o.debug('Multiblock is not placeable at location'), (r.cancel = !0));
      return;
    }
    ((u[i.index] = 0), (r.permutationToPlace = Q(a.type.id, u)));
    let w = i.size[0] * i.size[1] * i.size[2];
    for (let C = 1; C < w; C++) {
      u[i.index] = C;
      let P = Q(a.type.id, u),
        O = p[C];
      O
        ? en.run(() => {
            O.setPermutation(P);
          })
        : o.error('Block not found for index', C, 'at location', c);
    }
    return (U.triggerPlaceParticles(p, i.size, s), U.playPlacementSound(w, s, r.block.location), p);
  }
  onPlayerBreak(r) {
    let { brokenBlockPermutation: t, dimension: n, player: o } = r;
    if (
      !o ||
      y
        .getEquippableComponent(o)
        ?.getEquipment(Ou.Mainhand)
        ?.getComponent(Lu.Enchantable)
        ?.hasEnchantment(Dr.SilkTouch)
    )
      return;
    let u = o.getGameMode();
    if (u && u !== di.Creative && u !== di.Spectator) {
      let _ = t.getItemStack();
      _ && n.spawnItem(_, f.from(r.block.location));
    }
  }
  onBreak(r, t) {
    let n = U.validate(t.params);
    if (!n) return;
    let { block: o, dimension: i, brokenBlockPermutation: a } = r,
      u = U.getDestroyBlocks(o, a, n),
      _ = n.size[0] * n.size[1] * n.size[2];
    if (!u || u.length !== _) {
      U.log.error(
        'Destroy blocks not found or size mismatch at',
        o.location,
        'expected:',
        _,
        'got:',
        u?.length,
      );
      return;
    }
    en.waitTicks(1).then(() => {
      u.forEach((s) => {
        if (!s) return;
        let c = f.from(s.location);
        i.runCommand(
          `execute if block ${c.toString('short', ' ')} ${a.type.id} run setblock ${c.toString('short', ' ')} ${te.Air} destroy`,
        );
      });
    });
  }
  static getPlacementBlocks(r, t, n, o) {
    let i = [];
    for (let a = 0; a < n[1]; a++)
      for (let u = 0; u < n[2]; u++)
        for (let _ = 0; _ < n[0]; _++) {
          let s;
          switch (o) {
            case Be.South:
              s = f.from(t.x - _, t.y + a, t.z + u);
              break;
            case Be.West:
              s = f.from(t.x - u, t.y + a, t.z - _);
              break;
            case Be.North:
              s = f.from(t.x + _, t.y + a, t.z - u);
              break;
            case Be.East:
              s = f.from(t.x + u, t.y + a, t.z + _);
              break;
            default:
              s = f.from(t.x + _, t.y + a, t.z + u);
              break;
          }
          i.push(r.getBlock(s));
        }
    return i;
  }
  static getBaseBlock(r, t, n, o) {
    let i = t.getState(n.index);
    if (i === void 0) {
      this.log.error('Index state not found in block permutation');
      return;
    }
    if (i === 0) return r;
    let a = n.size,
      u = [],
      _ = 0;
    for (let s = 0; s < a[1]; s++)
      for (let c = 0; c < a[2]; c++)
        for (let p = 0; p < a[0]; p++) {
          let w;
          switch (o) {
            case Be.South:
              w = f.from(-p, s, c);
              break;
            case Be.West:
              w = f.from(-c, s, -p);
              break;
            case Be.North:
              w = f.from(p, s, -c);
              break;
            case Be.East:
              w = f.from(c, s, p);
              break;
            default:
              w = f.from(p, s, c);
          }
          if ((u.push(w), _ === i)) return r.dimension.getBlock(f.from(r.location).subtract(u[_]));
          _++;
        }
    this.log.error('Cannot find base block for index', i);
  }
  static getDestroyBlocks(r, t, n) {
    let o = r.dimension,
      i = n.size,
      a = U.toDirection(t.getState('minecraft:cardinal_direction'));
    if (!a && n.rotate) {
      this.log.error('Invalid rotation state in block permutation');
      return;
    }
    let u = U.getBaseBlock(r, t, n, a);
    if (!u) {
      this.log.error('Base block not found');
      return;
    }
    let _ = f.from(u.location);
    return U.getPlacementBlocks(o, _, i, a);
  }
  static isPlaceable(r) {
    return r.every((t) => t && ur.includes(t.typeId));
  }
  static toDirection(r) {
    return typeof r != 'string'
      ? void 0
      : { north: Be.North, east: Be.East, south: Be.South, west: Be.West }[r];
  }
  static getBaseBlockLocations(r, t) {
    let n = t[0] * t[2];
    return r
      .slice(0, n)
      .filter((o) => o !== void 0)
      .map((o) => f.from(o.location));
  }
  static triggerPlaceParticles(r, t, n) {
    let o = U.getBaseBlockLocations(r, t);
    for (let i of o)
      en.run(() => {
        n.spawnParticle('xp_furniture:block.dust', i);
      });
  }
  static playPlacementSound(r, t, n) {
    let o = r >= 8 ? 'xp_furniture:placement.heavy' : 'xp_furniture:placement.medium';
    en.run(() => {
      t.playSound(o, n);
    });
  }
  static validate(r) {
    if (typeof r != 'object' || r === null) {
      this.log.error('MultiblockComponent has no arguments. Expected an object.');
      return;
    }
    for (let [n, o] of Object.entries(U.schema)) {
      let i = r[n];
      if (!(n in r)) {
        if (o.required) {
          this.log.error(`MultiblockComponent is missing required argument: "${n}"`);
          return;
        }
        continue;
      }
      if (o.type === 'Vec3') {
        if (!Array.isArray(i) || i.length !== 3 || !i.every((a) => typeof a == 'number')) {
          this.log.error(
            `MultiblockComponent | "${n}" has an invalid Vec3. Expected an array of 3 numbers, got ${JSON.stringify(i)}`,
          );
          return;
        }
      } else if (typeof i !== o.type) {
        this.log.error(
          `MultiblockComponent | "${n}" has an invalid type. Expected ${o.type}, got ${typeof i}`,
        );
        return;
      }
    }
    let t = r;
    return { size: t.size, index: t.index, rotate: t.rotate ?? !0 };
  }
};
((U.componentId = 'xp_furniture:multiblock'),
  (U.log = h.getLogger('MultiblockComponent')),
  (U.schema = {
    size: { type: 'Vec3', required: !0 },
    index: { type: 'string', required: !0 },
    rotate: { type: 'boolean', required: !1 },
  }),
  d([m], U.prototype, 'beforeOnPlayerPlace', 1),
  d([m], U.prototype, 'onPlayerBreak', 1),
  d([m], U.prototype, 'onBreak', 1),
  (U = d([x], U)));
import { Direction as fe, EntityComponentTypes as qu, system as ci } from '@minecraft/server';
var D = class {
  beforeOnPlayerPlace(r, t) {
    let n = this.validate(t.params);
    if (!n) return;
    let { permutationToPlace: o, block: i, dimension: a } = r;
    try {
      r.permutationToPlace = o.withState('xp_furniture:is_placed', !0);
    } catch {}
    if (n.multiblockIndex) {
      let C = o.getState(n.multiblockIndex);
      if (C !== void 0 && C !== 0) return;
    }
    let u = fe.South,
      _ = ['minecraft:cardinal_direction', 'minecraft:facing_direction', 'minecraft:block_face'];
    for (let C of _)
      try {
        let P = o.getState(C);
        if (
          ((u =
            typeof P == 'string' ? P.charAt(0).toUpperCase() + P.slice(1).toLowerCase() : void 0),
          u !== void 0)
        )
          break;
      } catch {}
    let s = {
        [fe.North]: [0, 0],
        [fe.East]: [0, 90],
        [fe.South]: [0, 180],
        [fe.West]: [0, -90],
        [fe.Up]: [-90, 0],
        [fe.Down]: [90, 0],
      },
      c = { 0: fe.North, 90: fe.East, 180: fe.South, '-90': fe.West },
      p = s[u];
    n.rotationOffset &&
      ((p[0] += n.rotationOffset[0] % 360),
      p[0] > 90 && (p[0] -= 360),
      p[0] < -90 && (p[0] += 360),
      (p[1] += n.rotationOffset[1] % 360),
      p[1] > 180 && (p[1] -= 360),
      p[1] < -180 && (p[1] += 360));
    let w = i.location;
    ci.run(() => {
      let C = a.getBlock(w);
      if (!C) {
        D.log.error(`Block not found after placement at ${w}`);
        return;
      }
      let P = f.from(C.bottomCenter()).add(n.offset ?? f.Zero.toArray()),
        F = `xp_furniture:tile_entity_spawn.${c[p[1]].toLowerCase()}`,
        B = F,
        A = [];
      (n.event &&
        (Array.isArray(n.event)
          ? (n.event.length > 0 && (B = n.event[0]), n.event.length > 1 && (A = n.event.slice(1)))
          : (B = n.event)),
        B === 'default' && (B = F),
        (A = A.map((K) => (K === 'default' ? F : K))));
      let $ = ['summon', n.entity, P.toString('short', ' '), p[1], p[0], B];
      try {
        a.runCommand($.filter((K) => K != null).join(' '));
      } catch {}
      let N = a.getEntities({ type: n.entity, location: P, closest: 1, maxDistance: 1 })?.[0];
      if (!N) D.log.error(`Failed to spawn entity "${n.entity}"`);
      else {
        if ((D.invokeEvents(N, A), n.dynamicProperties)) {
          let Se = {};
          for (let [Fo, je] of Object.entries(n.dynamicProperties))
            Se[Fo] = Array.isArray(je) ? { x: je[0], y: je[1], z: je[2] } : je;
          N.setDynamicProperties(Se);
        }
        let K = this.calculateMultiblockPositions(C, u, n.multiblockSize);
        (this.storeBlocksOnEntity(N, K),
          D.log.info(
            `Spawned: ${N.typeId}, rot: [${p[0]}, ${p[1]}], event: ${B}, for: ${C.typeId}`,
          ));
      }
    });
  }
  onBreak(r, t) {
    let n = this.validate(t.params);
    if (!n) return;
    let { block: o, dimension: i, brokenBlockPermutation: a } = r,
      u = f.from(o.location),
      _ = i.getEntitiesAtBlockLocation(u),
      s;
    for (let c of _) {
      let p = D.getBlockLocationsFromEntity(c);
      if ((p && p.some((w) => w.equals(u))) || c.matches({ type: n.entity })) {
        s = c;
        break;
      }
    }
    if (s) {
      D.dropItems(s, u, i);
      let c = n.despawnEvent ?? 'xp_furniture:instant_despawn';
      (D.invokeEvents(s, c, !0), D.log.info(`Removed: ${s.typeId}, for ${a.type.id}`));
    }
  }
  static onEntityRemove(r) {
    let { removedEntity: t } = r,
      n = t && t.typeId;
    if (!n || !n.startsWith('xp_furniture') || !t.matches({ families: ['furniture', 'inanimate'] }))
      return;
    let o = t.dimension,
      i = this.getBlockLocationsFromEntity(t);
    if (i)
      for (let a = 0; a < i.length; a++) {
        let u = i[a],
          _ = f.from(u),
          s = o.getBlock(_);
        if (!s) continue;
        let c;
        if (a === 0 && U.isMultiblock(s)) {
          let p = s.permutation.getItemStack();
          p && (c = p);
        }
        ci.run(() => {
          (o.runCommand(`setblock ${_.toString('short', ' ')} air destroy`),
            c && o.spawnItem(c, _));
        });
      }
  }
  static invokeEvents(r, t, n = !1) {
    let o = [],
      i = [];
    if (Array.isArray(t))
      for (let a of t)
        try {
          (r.triggerEvent(a), o.push(a));
        } catch {
          i.push(a);
        }
    else
      try {
        (r.triggerEvent(t), o.push(t));
      } catch {
        i.push(t);
      }
    if ((o.length && this.log.debug(`Triggered events: ${o.join(', ')}`), i.length)) {
      if (!n) {
        this.log.warn(`Failed to trigger events: ${i.join(', ')}`);
        return;
      }
      r.remove();
    }
  }
  calculateMultiblockPositions(r, t, n) {
    let o = r.location,
      i = [];
    if (!n) return (i.push(f.from(o).toString('short', '.')), i);
    for (let a = 0; a < n[1]; a++)
      for (let u = 0; u < n[2]; u++)
        for (let _ = 0; _ < n[0]; _++) {
          let s, c, p;
          switch (((c = o.y + a), t)) {
            case fe.South:
              ((s = o.x - _), (p = o.z + u));
              break;
            case fe.West:
              ((s = o.x - u), (p = o.z - _));
              break;
            case fe.North:
              ((s = o.x + _), (p = o.z - u));
              break;
            case fe.East:
              ((s = o.x + u), (p = o.z + _));
              break;
            default:
              ((s = o.x + _), (p = o.z + u));
              break;
          }
          i.push(f.from(s, c, p).toString('short', '.'));
        }
    return i;
  }
  storeBlocksOnEntity(r, t) {
    try {
      let n = JSON.stringify(t);
      r.setDynamicProperty(D.BLOCKS_PROPERTY, n);
    } catch (n) {
      D.log.error(`Failed to store blocks on entity: ${n}`);
    }
  }
  static dispellEffects(r) {
    let { entity: t, effectType: n } = r;
    n === Pt.Invisibility ||
      !t ||
      !t.isValid ||
      !t.typeId.startsWith('xp_furniture') ||
      !t.matches({ families: ['furniture', 'inanimate'] }) ||
      ((r.cancel = !0), this.log.info(`Removed effect: ${n} on entity ${t.typeId}`));
  }
  static onInit(r) {
    let t = r.entity;
    if (
      !t ||
      !t.isValid ||
      !t.typeId.startsWith('xp_furniture') ||
      !t.matches({ families: ['furniture', 'inanimate'] })
    )
      return;
    let { location: n, dimension: o, typeId: i } = t,
      a = o.getBlock(n);
    if (!a || !a.typeId.startsWith('xp_fur')) {
      (this.log.error(
        `Missing block: ${f.from(n).floor().toString('short')}, for: ${i}. Removing entity...`,
      ),
        this.invokeEvents(t, 'xp_furniture:despawn', !0));
      return;
    }
    this.nameEntity(t, a);
  }
  static nameEntity(r, t) {
    r.matches({ families: ['xp_named'] }) &&
      ((r.nameTag = `tile.${t.typeId}.name`), this.log.info(`Name set: ${r.nameTag}`));
  }
  static dropItems(r, t, n) {
    let o = r.getComponent(qu.Inventory)?.container;
    if (!o) return;
    let i = 0;
    for (let a = 0; a < o.size; a++) this.dropItem(o, a, n, t) && i++;
    this.log.info(`Dropped ${i} item(s) from entity ${r.typeId}`);
  }
  static dropItem(r, t, n, o) {
    let i = r.getItem(t);
    return i
      ? (n.spawnItem(i, o),
        r.setItem(t, void 0),
        this.log.trace(`Dropped: ${i.amount}x ${i.typeId}, from slot: ${t}`),
        !0)
      : !1;
  }
  static getBlockLocationsFromEntity(r) {
    let t = r.getDynamicProperty(D.BLOCKS_PROPERTY);
    if (typeof t == 'string')
      try {
        let n = JSON.parse(t);
        if (Array.isArray(n)) return n.map((o) => f.from(o.split('.').map(Number)));
      } catch {
        return;
      }
  }
  static getEntityFromBlock(r, t = { entityTypeId: void 0, searchRadius: 1 }) {
    let { location: n, dimension: o } = r,
      i =
        t.searchRadius && t.searchRadius > 1
          ? o.getEntities({
              type: t.entityTypeId ?? r.typeId,
              location: n,
              maxDistance: t.searchRadius,
            })
          : o.getEntitiesAtBlockLocation(n);
    for (let a of i) {
      let u = this.getBlockLocationsFromEntity(a);
      if ((u && u.some((_) => _.equals(n))) || a.matches({ type: t.entityTypeId ?? r.typeId }))
        return a;
    }
  }
  validate(r) {
    if (typeof r != 'object' || r === null) {
      D.log.error('TileEntity has no arguments. Expected an object.');
      return;
    }
    for (let [t, n] of Object.entries(D.schema)) {
      if (!(t in r)) {
        if (n.required) {
          D.log.error(`TileEntity component is missing required argument: "${t}"`);
          return;
        }
        continue;
      }
      let o = r[t],
        i = D.typeValidators[n.type];
      if (i && !i(o)) {
        D.log.error(
          `TileEntity | "${t}" has an invalid type. Expected ${n.type}, got ${JSON.stringify(o)}`,
        );
        return;
      }
    }
    return r;
  }
};
((D.componentId = 'xp_furniture:tile_entity'),
  (D.log = h.getLogger('TileEntity')),
  (D.BLOCKS_PROPERTY = 'xp_furniture:tile_blocks'),
  (D.typeValidators = {
    string: (r) => typeof r == 'string',
    number: (r) => typeof r == 'number',
    boolean: (r) => typeof r == 'boolean',
    Vec2: (r) => Array.isArray(r) && r.length === 2 && r.every((t) => typeof t == 'number'),
    Vec3: (r) => Array.isArray(r) && r.length === 3 && r.every((t) => typeof t == 'number'),
    'string | string[]': (r) =>
      typeof r == 'string' || (Array.isArray(r) && r.every((t) => typeof t == 'string')),
    'Record<string, string | number | boolean | Vec3>': (r) =>
      typeof r != 'object' || r === null || Array.isArray(r)
        ? !1
        : Object.values(r).every(
            (t) =>
              typeof t == 'string' ||
              typeof t == 'number' ||
              typeof t == 'boolean' ||
              (Array.isArray(t) && t.length === 3 && t.every((n) => typeof n == 'number')),
          ),
  }),
  (D.schema = {
    entity: { type: 'string', required: !0 },
    offset: { type: 'Vec3', required: !1 },
    event: { type: 'string | string[]', required: !1 },
    despawnEvent: { type: 'string | string[]', required: !1 },
    rotationOffset: { type: 'Vec2', required: !1 },
    dynamicProperties: { type: 'Record<string, string | number | boolean | Vec3>', required: !1 },
    multiblockIndex: { type: 'string', required: !1 },
    multiblockSize: { type: 'Vec3', required: !1 },
  }),
  d([m], D.prototype, 'beforeOnPlayerPlace', 1),
  d([m], D.prototype, 'onBreak', 1),
  d([ai], D, 'onEntityRemove', 1),
  d([ui], D, 'dispellEffects', 1),
  d([oi, Zr], D, 'onInit', 1),
  (D = d([x], D)));
var zu = [E.Torch, E.RedstoneTorch, E.SoulTorch],
  Ru = [
    'xp_furniture:carpet_black',
    'xp_furniture:carpet_blue',
    'xp_furniture:carpet_grey',
    'xp_furniture:carpet_lavender',
    'xp_furniture:carpet_lime',
    'xp_furniture:carpet_purple',
    'xp_furniture:carpet_red',
    'xp_furniture:carpet_white',
    'xp_furniture:oak_gate',
    'xp_furniture:birch_gate',
    'xp_furniture:acacia_gate',
    'xp_furniture:bamboo_gate',
    'xp_furniture:cherry_gate',
    'xp_furniture:jungle_gate',
    'xp_furniture:spruce_gate',
    'xp_furniture:dark_oak_gate',
    'xp_furniture:pale_oak_gate',
    'xp_furniture:mangrove_gate',
    'xp_furniture:warped_gate',
    'xp_furniture:crimson_gate',
  ],
  rn = class {
    static shouldCancelPlacement(r) {
      let t = r.block,
        n = r.itemStack;
      return !t || !n
        ? !1
        : zu.includes(n.typeId) && Ru.includes(t.typeId)
          ? ((r.cancel = !0), !0)
          : !1;
    }
  };
d([Mt], rn, 'shouldCancelPlacement', 1);
import { system as pi } from '@minecraft/server';
var Ar = class {
  constructor() {
    this.stateId = 'xp_furniture:is_top_bit';
  }
  beforeOnPlayerPlace(r) {
    let t = r.permutationToPlace.type.id,
      n = r.permutationToPlace.getAllStates();
    if (!r.player) {
      r.cancel = !0;
      return;
    }
    let i = Math.round((r.player.getRotation().y * 4) / 360);
    if (r.permutationToPlace.type.id.includes('hanging')) {
      let a = r.block.below();
      if (!a || !a.isAir) {
        r.cancel = !0;
        return;
      }
      ((n[this.stateId] = 1),
        (r.permutationToPlace = Q(t, n)),
        pi.run(() => {
          ((n[this.stateId] = 0), a.setPermutation(Q(t, n)));
          try {
            a.dimension.runCommand(
              `summon ${t}.e ${f.from(a.location).add(0.5, 0, 0.5).toString('short', ' ')} ${i} 0`,
            );
          } catch {}
        }));
    } else {
      let a = r.block.above();
      if (!a || !a.isAir) {
        r.cancel = !0;
        return;
      }
      ((n[this.stateId] = 0),
        (r.permutationToPlace = Q(t, n)),
        pi.run(() => {
          ((n[this.stateId] = 1), a.setPermutation(Q(t, n)));
          try {
            r.block.dimension.runCommand(
              `summon ${t}.e ${f.from(r.block.location).add(0.5, 0, 0.5).toString('short', ' ')} ${i} 0`,
            );
          } catch {}
        }));
    }
  }
  onBreak(r) {
    let t = r.brokenBlockPermutation.getState(this.stateId),
      n = r.brokenBlockPermutation.type.id;
    if (t) {
      let o = r.block.below();
      if (o) {
        let i = o.dimension
          .getEntitiesAtBlockLocation(o.location)
          .filter((a) => a.typeId === n + '.e');
        if (i.length > 0) for (let a of i) a.remove();
        o.dimension.runCommand(`setblock ${f.from(o.location).toString('short', ' ')} air destroy`);
      }
    } else {
      let o = r.block.above();
      if (o) {
        let i = r.block.dimension
          .getEntitiesAtBlockLocation(r.block.location)
          .filter((a) => a.typeId === n + '.e');
        if (i.length > 0) for (let a of i) a.remove();
        o.dimension.runCommand(`setblock ${f.from(o.location).toString('short', ' ')} air destroy`);
      }
    }
  }
};
((Ar.componentId = 'xp_furniture:add_lower_piece'),
  d([m], Ar.prototype, 'beforeOnPlayerPlace', 1),
  d([m], Ar.prototype, 'onBreak', 1),
  (Ar = d([x], Ar)));
import { BlockPermutation as Nu } from '@minecraft/server';
import { Direction as Tr } from '@minecraft/server';
import { LocationOutOfWorldBoundariesError as fi } from '@minecraft/server';
var tn = class {
    constructor(r = !1, t = void 0, n = void 0, o = void 0) {
      ((this.success = r), (this.block = t), (this.blockTypeId = n), (this.location = o));
    }
  },
  Ir = class e {
    constructor(r, t, n) {
      ((this.dimension = r), (this.min = t), (this.max = n));
    }
    static aroundOrigin(r, t, n) {
      return new e(
        r,
        { x: t.x - n.x, y: t.y - n.y, z: t.z - n.z },
        { x: t.x + n.x, y: t.y + n.y, z: t.z + n.z },
      );
    }
    toString() {
      return `blockRegion(${this.dimension.id}, ${JSON.stringify(this.min)}, ${JSON.stringify(this.max)})`;
    }
    fetchBlocks() {
      let r = [];
      for (let t = Math.min(this.min.x, this.max.x); t <= Math.max(this.min.x, this.max.x); t++)
        for (let n = Math.min(this.min.y, this.max.y); n <= Math.max(this.min.y, this.max.y); n++)
          for (let o = Math.min(this.min.z, this.max.z); o <= Math.max(this.min.z, this.max.z); o++)
            try {
              let i = this.dimension.getBlock({ x: t, y: n, z: o });
              i?.isAir || r.push(i);
            } catch (i) {
              if (i instanceof fi) continue;
              throw i;
            }
      return r;
    }
    anyBlockMatch(r) {
      for (let t = this.min.y; t < this.max.y; t++)
        for (let n = this.min.x; n < this.max.x; n++)
          for (let o = this.min.z; o < this.max.z; o++) {
            let i = { x: n, y: t, z: o },
              a;
            try {
              a = this.dimension.getBlock(i);
            } catch (u) {
              if (u instanceof fi) continue;
              throw u;
            }
            if (a !== void 0) {
              for (let u of r) if (a.permutation.matches(u)) return new tn(!0, a, u, i);
            }
          }
      return new tn(!1);
    }
  };
var nn = [
  'minecraft:acacia_button',
  'minecraft:acacia_door',
  'minecraft:acacia_fence_gate',
  'minecraft:acacia_hanging_sign',
  'minecraft:acacia_pressure_plate',
  'minecraft:acacia_trapdoor',
  'minecraft:activator_rail',
  'minecraft:air',
  'minecraft:amethyst_cluster',
  'minecraft:anvil',
  'minecraft:azalea_leaves_flowered',
  'minecraft:azalea_leaves',
  'minecraft:azalea',
  'minecraft:bamboo_button',
  'minecraft:bamboo_door',
  'minecraft:bamboo_fence_gate',
  'minecraft:bamboo_hanging_sign',
  'minecraft:bamboo_mosaic_slab',
  'minecraft:bamboo_pressure_plate',
  'minecraft:bamboo_sapling',
  'minecraft:bamboo_slab',
  'minecraft:bamboo_trapdoor',
  'minecraft:barrier',
  'minecraft:bed',
  'minecraft:beetroot',
  'minecraft:bell',
  'minecraft:big_dripleaf',
  'minecraft:birch_button',
  'minecraft:birch_door',
  'minecraft:birch_fence_gate',
  'minecraft:birch_hanging_sign',
  'minecraft:birch_pressure_plate',
  'minecraft:birch_trapdoor',
  'minecraft:black_candle_cake',
  'minecraft:black_candle',
  'minecraft:black_carpet',
  'minecraft:blackstone_slab',
  'minecraft:blue_candle_cake',
  'minecraft:blue_candle',
  'minecraft:blue_carpet',
  'minecraft:brain_coral',
  'minecraft:brewing_stand',
  'minecraft:brown_candle_cake',
  'minecraft:brown_candle',
  'minecraft:brown_carpet',
  'minecraft:brown_mushroom',
  'minecraft:bubble_column',
  'minecraft:bubble_coral',
  'minecraft:cactus',
  'minecraft:cake',
  'minecraft:cake',
  'minecraft:calibrated_sculk_sensor',
  'minecraft:carpet',
  'minecraft:carrots',
  'minecraft:cave_vines_body_with_berries',
  'minecraft:cave_vines_head_with_berries',
  'minecraft:cave_vines',
  'minecraft:chain',
  'minecraft:cherry_button',
  'minecraft:cherry_door',
  'minecraft:cherry_fence_gate',
  'minecraft:cherry_hanging_sign',
  'minecraft:cherry_leaves',
  'minecraft:cherry_pressure_plate',
  'minecraft:cherry_sapling',
  'minecraft:cherry_slab',
  'minecraft:cherry_trapdoor',
  'minecraft:chest',
  'minecraft:chorus_flower',
  'minecraft:chorus_plant',
  'minecraft:cobbled_deepslate_slab',
  'minecraft:conduit',
  'minecraft:coral_fan_dead',
  'minecraft:coral_fan_hang',
  'minecraft:coral_fan_hang2',
  'minecraft:coral_fan_hang3',
  'minecraft:coral_fan',
  'minecraft:crimson_button',
  'minecraft:crimson_door',
  'minecraft:crimson_fence_gate',
  'minecraft:crimson_fungus',
  'minecraft:crimson_hanging_sign',
  'minecraft:crimson_pressure_plate',
  'minecraft:crimson_slab',
  'minecraft:crimson_trapdoor',
  'minecraft:cut_copper_slab',
  'minecraft:cyan_candle_cake',
  'minecraft:cyan_candle',
  'minecraft:cyan_carpet',
  'minecraft:dark_oak_button',
  'minecraft:dark_oak_door',
  'minecraft:dark_oak_fence_gate',
  'minecraft:dark_oak_hanging_sign',
  'minecraft:dark_oak_pressure_plate',
  'minecraft:dark_oak_trapdoor',
  'minecraft:daylight_detector_inverted',
  'minecraft:daylight_detector',
  'minecraft:dead_brain_coral',
  'minecraft:dead_bubble_coral',
  'minecraft:dead_fire_coral',
  'minecraft:dead_horn_coral',
  'minecraft:dead_tube_coral',
  'minecraft:deadbush',
  'minecraft:decorated_pot',
  'minecraft:deepslate_brick_slab',
  'minecraft:deepslate_tile_slab',
  'minecraft:detector_rail',
  'minecraft:double_plant',
  'minecraft:dragon_egg',
  'minecraft:enchanting_table',
  'minecraft:end_portal',
  'minecraft:end_rod',
  'minecraft:ender_chest',
  'minecraft:exposed_cut_copper_slab',
  'minecraft:fence_gate',
  'minecraft:fire_coral',
  'minecraft:fire',
  'minecraft:flower_pot',
  'minecraft:skull',
  'minecraft:flowing_lava',
  'minecraft:flowing_water',
  'minecraft:glow_lichen',
  'minecraft:golden_rail',
  'minecraft:gray_candle_cake',
  'minecraft:gray_candle',
  'minecraft:gray_carpet',
  'minecraft:green_candle_cake',
  'minecraft:green_candle',
  'minecraft:green_carpet',
  'minecraft:grindstone',
  'minecraft:hanging_roots',
  'minecraft:heavy_weighted_pressure_plate',
  'minecraft:hopper',
  'minecraft:horn_coral',
  'minecraft:iron_door',
  'minecraft:iron_trapdoor',
  'minecraft:jungle_button',
  'minecraft:jungle_door',
  'minecraft:jungle_fence_gate',
  'minecraft:jungle_hanging_sign',
  'minecraft:jungle_pressure_plate',
  'minecraft:jungle_trapdoor',
  'minecraft:kelp',
  'minecraft:ladder',
  'minecraft:lantern',
  'minecraft:large_amethyst_bud',
  'minecraft:lava',
  'minecraft:leaves',
  'minecraft:leaves2',
  'minecraft:lectern',
  'minecraft:lever',
  'minecraft:light_block',
  'minecraft:light_blue_candle_cake',
  'minecraft:light_blue_candle',
  'minecraft:light_blue_carpet',
  'minecraft:light_gray_candle_cake',
  'minecraft:light_gray_candle',
  'minecraft:light_gray_carpet',
  'minecraft:light_weighted_pressure_plate',
  'minecraft:lightning_rod',
  'minecraft:lime_candle_cake',
  'minecraft:lime_candle',
  'minecraft:lime_carpet',
  'minecraft:magenta_candle_cake',
  'minecraft:magenta_candle',
  'minecraft:magenta_carpet',
  'minecraft:mangrove_button',
  'minecraft:mangrove_door',
  'minecraft:mangrove_fence_gate',
  'minecraft:mangrove_hanging_sign',
  'minecraft:mangrove_leaves',
  'minecraft:mangrove_pressure_plate',
  'minecraft:mangrove_roots',
  'minecraft:mangrove_slab',
  'minecraft:mangrove_trapdoor',
  'minecraft:medium_amethyst_bud',
  'minecraft:melon_stem',
  'minecraft:moss_carpet',
  'minecraft:mud_brick_slab',
  'minecraft:nether_sprouts',
  'minecraft:nether_wart',
  'minecraft:oak_hanging_sign',
  'minecraft:orange_candle_cake',
  'minecraft:orange_candle',
  'minecraft:orange_carpet',
  'minecraft:oxidized_cut_copper_slab',
  'minecraft:pink_candle_cake',
  'minecraft:pink_candle',
  'minecraft:pink_carpet',
  'minecraft:pink_petals',
  'minecraft:pitcher_crop',
  'minecraft:pitcher_plant',
  'minecraft:pointed_dripstone',
  'minecraft:polished_blackstone_brick_slab',
  'minecraft:polished_blackstone_button',
  'minecraft:polished_blackstone_pressure_plate',
  'minecraft:polished_blackstone_slab',
  'minecraft:polished_deepslate_slab',
  'minecraft:portal',
  'minecraft:potatoes',
  'minecraft:powered_comparator',
  'minecraft:powered_repeater',
  'minecraft:pumpkin_stem',
  'minecraft:purple_candle_cake',
  'minecraft:purple_candle',
  'minecraft:purple_carpet',
  'minecraft:rail',
  'minecraft:red_candle_cake',
  'minecraft:red_candle',
  'minecraft:red_carpet',
  'minecraft:red_flower',
  'minecraft:red_mushroom',
  'minecraft:redstone_torch',
  'minecraft:redstone_wire',
  'minecraft:reeds',
  'minecraft:sapling',
  'minecraft:scaffolding',
  'minecraft:sculk_sensor',
  'minecraft:sculk_shrieker',
  'minecraft:sculk_vein',
  'minecraft:sea_pickle',
  'minecraft:seagrass',
  'minecraft:small_amethyst_bud',
  'minecraft:small_dripleaf_block',
  'minecraft:sniffer_egg',
  'minecraft:snow_layer',
  'minecraft:soul_campfire',
  'minecraft:soul_lantern',
  'minecraft:spore_blossom',
  'minecraft:spruce_button',
  'minecraft:spruce_door',
  'minecraft:spruce_fence_gate',
  'minecraft:spruce_hanging_sign',
  'minecraft:spruce_pressure_plate',
  'minecraft:spruce_trapdoor',
  'minecraft:standing_banner',
  'minecraft:stone_block_slab',
  'minecraft:stone_block_slab2',
  'minecraft:stone_block_slab3',
  'minecraft:stone_block_slab4',
  'minecraft:stone_button',
  'minecraft:stone_button',
  'minecraft:stone_pressure_plate',
  'minecraft:stonecutter_block',
  'minecraft:structure_void',
  'minecraft:sweet_berry_bush',
  'minecraft:tallgrass',
  'minecraft:torch',
  'minecraft:torchflower',
  'minecraft:trapdoor',
  'minecraft:trip_wire',
  'minecraft:tripwire_hook',
  'minecraft:tube_coral',
  'minecraft:frog_spawn',
  'minecraft:turtle_egg',
  'minecraft:twisting_vines',
  'minecraft:unlit_redstone_torch',
  'minecraft:unpowered_comparator',
  'minecraft:unpowered_repeater',
  'minecraft:vine',
  'minecraft:wall_banner',
  'minecraft:warped_button',
  'minecraft:warped_door',
  'minecraft:warped_fence_gate',
  'minecraft:warped_fungus',
  'minecraft:warped_hanging_sign',
  'minecraft:warped_pressure_plate',
  'minecraft:warped_slab',
  'minecraft:warped_trapdoor',
  'minecraft:pale_oak_fence_gate',
  'minecraft:water',
  'minecraft:waterlily',
  'minecraft:waterlily',
  'minecraft:waxed_cut_copper_slab',
  'minecraft:waxed_exposed_cut_copper_slab',
  'minecraft:waxed_oxidized_cut_copper_slab',
  'minecraft:waxed_weathered_cut_copper_slab',
  'minecraft:weathered_cut_copper_slab',
  'minecraft:web',
  'minecraft:wheat',
  'minecraft:white_candle_cake',
  'minecraft:white_candle',
  'minecraft:white_carpet',
  'minecraft:wither_rose',
  'minecraft:wooden_button',
  'minecraft:wooden_button',
  'minecraft:wooden_door',
  'minecraft:wooden_pressure_plate',
  'minecraft:wooden_slab',
  'minecraft:yellow_candle_cake',
  'minecraft:yellow_candle',
  'minecraft:yellow_carpet',
  'minecraft:yellow_flower',
  'xp_furniture:blazing_star',
  'xp_furniture:butterflower_cluster',
  'xp_furniture:cattail',
  'xp_furniture:clover_cluster',
  'xp_furniture:duckweed',
  'xp_furniture:flower_cluster_0',
  'xp_furniture:flower_cluster_1',
  'xp_furniture:flower_cluster_2',
  'xp_furniture:flower_cluster_3',
  'xp_furniture:foxglove',
  'xp_furniture:ivy',
  'xp_furniture:lotus_lilypad_pink',
  'xp_furniture:lotus_lilypad_purple',
  'xp_furniture:lotus_lilypad_white',
  'xp_furniture:mushroom_cluster',
  'xp_furniture:pot_1',
  'xp_furniture:pot_2',
  'xp_furniture:pot_3',
  'xp_furniture:shelf_fungus',
  'xp_furniture:small_cactus_0',
  'xp_furniture:small_cactus_1',
  'xp_furniture:small_cactus_2',
  'xp_furniture:small_cluster_lily_pad',
  'xp_furniture:clover_weeds',
  'xp_furniture:cluster_weeds',
  'xp_furniture:small_weeds_cluster',
  'xp_furniture:spike_weeds',
  'xp_furniture:tall_weeds',
  'xp_furniture:fallen_leaves',
  'xp_furniture:leaf_pile',
  'xp_furniture:big_spiky_plant',
  'xp_furniture:bush',
  'xp_furniture:fern',
  'xp_furniture:leafy_plant_0',
  'xp_furniture:leafy_plant_1',
  'xp_furniture:plant_monstera',
  'xp_furniture:succulent',
  'xp_furniture:small_azalea_tree',
  'xp_furniture:dog_wood_leaves',
  'xp_furniture:dog_wood_leaves_full',
  'xp_furniture:golden_chain_leaves_full',
  'xp_furniture:golden_chain_leaves',
  'xp_furniture:orange_acacia_leaves',
  'xp_furniture:orange_acacia_leaves_full',
  'xp_furniture:golden_chain_leaves_hanging_bottom',
  'xp_furniture:golden_chain_leaves_hanging_top',
  'xp_furniture:wisteria_leaves',
  'xp_furniture:wisteria_leaves_full',
  'xp_furniture:yellow_birch_leaves',
  'xp_furniture:yellow_birch_leaves_full',
  'xp_furniture:wisteria_leaves_hanging_bottom',
  'xp_furniture:wisteria_leaves_hanging_top',
  'xp_furniture:acacia_sink',
  'xp_furniture:bamboo_sink',
  'xp_furniture:birch_sink',
  'xp_furniture:cherry_sink',
  'xp_furniture:crimson_sink',
  'xp_furniture:dark_oak_sink',
  'xp_furniture:jungle_sink',
  'xp_furniture:mangrove_sink',
  'xp_furniture:oak_sink',
  'xp_furniture:spruce_sink',
  'xp_furniture:warped_sink',
  'xp_furniture:book_pile',
  'xp_furniture:broom',
  'xp_furniture:gnome',
  'xp_furniture:log_stack',
  'xp_furniture:big_pan',
  'xp_furniture:pink_umbrella',
  'xp_furniture:red_umbrella',
  'xp_furniture:white_umbrella',
  'xp_furniture:urn_1',
  'xp_furniture:urn_2',
  'xp_furniture:urn_3',
  'xp_furniture:urn_4',
  'xp_furniture:wood_mug',
  'xp_furniture:wood_mug_full',
  'xp_furniture:wood_mug_cocoa',
  'xp_furniture:black_armchair',
  'xp_furniture:blue_armchair',
  'xp_furniture:brown_armchair',
  'xp_furniture:cyan_armchair',
  'xp_furniture:gray_armchair',
  'xp_furniture:green_armchair',
  'xp_furniture:light_blue_armchair',
  'xp_furniture:light_gray_armchair',
  'xp_furniture:lime_armchair',
  'xp_furniture:magenta_armchair',
  'xp_furniture:orange_armchair',
  'xp_furniture:pink_armchair',
  'xp_furniture:purple_armchair',
  'xp_furniture:red_armchair',
  'xp_furniture:white_armchair',
  'xp_furniture:yellow_armchair',
  'xp_furniture:carpet_black',
  'xp_furniture:carpet_blue',
  'xp_furniture:carpet_grey',
  'xp_furniture:carpet_lavender',
  'xp_furniture:carpet_lime',
  'xp_furniture:carpet_purple',
  'xp_furniture:carpet_red',
  'xp_furniture:carpet_white',
  'xp_furniture:acacia_chair',
  'xp_furniture:bamboo_chair',
  'xp_furniture:birch_chair',
  'xp_furniture:cherry_chair',
  'xp_furniture:crimson_chair',
  'xp_furniture:dark_oak_chair',
  'xp_furniture:jungle_chair',
  'xp_furniture:mangrove_chair',
  'xp_furniture:oak_chair',
  'xp_furniture:spruce_chair',
  'xp_furniture:warped_chair',
  'xp_furniture:pale_oak_chair',
  'xp_furniture:black_sofa',
  'xp_furniture:blue_sofa',
  'xp_furniture:brown_sofa',
  'xp_furniture:cyan_sofa',
  'xp_furniture:gray_sofa',
  'xp_furniture:green_sofa',
  'xp_furniture:light_blue_sofa',
  'xp_furniture:light_gray_sofa',
  'xp_furniture:lime_sofa',
  'xp_furniture:magenta_sofa',
  'xp_furniture:orange_sofa',
  'xp_furniture:pink_sofa',
  'xp_furniture:purple_sofa',
  'xp_furniture:red_sofa',
  'xp_furniture:white_sofa',
  'xp_furniture:yellow_sofa',
  'xp_furniture:black_sofa',
  'xp_furniture:blue_sofa',
  'xp_furniture:brown_sofa',
  'xp_furniture:cyan_sofa',
  'xp_furniture:gray_sofa',
  'xp_furniture:green_sofa',
  'xp_furniture:light_blue_sofa',
  'xp_furniture:light_gray_sofa',
  'xp_furniture:lime_sofa',
  'xp_furniture:magenta_sofa',
  'xp_furniture:orange_sofa',
  'xp_furniture:pink_sofa',
  'xp_furniture:purple_sofa',
  'xp_furniture:red_sofa',
  'xp_furniture:white_sofa',
  'xp_furniture:yellow_sofa',
  'xp_furniture:oak_lamp',
  'xp_furniture:cave_dweller_plushie',
  'xp_furniture:cow_plushie',
  'xp_furniture:creeper_plushie',
  'xp_furniture:enderman_plushie',
  'xp_furniture:pig_plushie',
  'xp_furniture:sheep_plushie',
  'xp_furniture:zombie_plushie',
  'xp_furniture:acacia_rocking_chair',
  'xp_furniture:bamboo_rocking_chair',
  'xp_furniture:birch_rocking_chair',
  'xp_furniture:cherry_rocking_chair',
  'xp_furniture:crimson_rocking_chair',
  'xp_furniture:dark_oak_rocking_chair',
  'xp_furniture:jungle_rocking_chair',
  'xp_furniture:mangrove_rocking_chair',
  'xp_furniture:oak_rocking_chair',
  'xp_furniture:spruce_rocking_chair',
  'xp_furniture:warped_rocking_chair',
  'xp_furniture:pale_oak_rocking_chair',
  'xp_furniture:oak_slab_chest',
  'xp_furniture:acacia_standing_lamp',
  'xp_furniture:bamboo_standing_lamp',
  'xp_furniture:birch_standing_lamp',
  'xp_furniture:cherry_standing_lamp',
  'xp_furniture:crimson_standing_lamp',
  'xp_furniture:dark_oak_standing_lamp',
  'xp_furniture:jungle_standing_lamp',
  'xp_furniture:mangrove_standing_lamp',
  'xp_furniture:oak_standing_lamp',
  'xp_furniture:spruce_standing_lamp',
  'xp_furniture:warped_standing_lamp',
  'xp_furniture:pale_oak_standing_lamp',
  'xp_furniture:aquarium',
  'xp_furniture:bongos',
  'xp_furniture:standing_camera',
  'xp_furniture:big_gold_candle_holder',
  'xp_furniture:big_metal_candle_holder',
  'xp_furniture:small_iron_candle_holder',
  'xp_furniture:small_metal_candle_holder',
  'xp_furniture:black_big_cauldron',
  'xp_furniture:copper_big_cauldron',
  'xp_furniture:metal_big_cauldron',
  'xp_furniture:chandelier_golden',
  'xp_furniture:chandelier',
  'xp_furniture:chicken_nest',
  'xp_furniture:globe_colored',
  'xp_furniture:globe',
  'xp_furniture:fancy_grandfather_clock',
  'xp_furniture:small_fancy_grandfather_clock',
  'xp_furniture:small_grandfather_clock',
  'xp_furniture:grandfather_clock',
  'xp_furniture:harp',
  'xp_furniture:haystack_pitchfork',
  'xp_furniture:scarecrow',
  'xp_furniture:telescope',
  'xp_furniture:tool_rack',
  'xp_furniture:ukulele',
  'xp_furniture:black_wood_pillow',
  'xp_furniture:blue_wood_pillow',
  'xp_furniture:brown_wood_pillow',
  'xp_furniture:cyan_wood_pillow',
  'xp_furniture:gray_wood_pillow',
  'xp_furniture:green_wood_pillow',
  'xp_furniture:light_blue_wood_pillow',
  'xp_furniture:light_gray_wood_pillow',
  'xp_furniture:lime_wood_pillow',
  'xp_furniture:magenta_wood_pillow',
  'xp_furniture:orange_wood_pillow',
  'xp_furniture:pink_wood_pillow',
  'xp_furniture:purple_wood_pillow',
  'xp_furniture:red_wood_pillow',
  'xp_furniture:white_wood_pillow',
  'xp_furniture:yellow_wood_pillow',
  'xp_furniture:bell_pepper_block',
  'xp_furniture:cabbage_block',
  'xp_furniture:corn_block_top',
  'xp_furniture:corn_block',
  'xp_furniture:eggplant_block',
  'xp_furniture:tomato_block',
  'xp_furniture:big_flower_pot_hanging_dark_green',
  'xp_furniture:big_flower_pot_hanging_decorated',
  'xp_furniture:big_flower_pot_hanging_dotted',
  'xp_furniture:big_flower_pot_hanging_lined',
  'xp_furniture:big_flower_pot_hanging_plain',
  'xp_furniture:big_flower_pot_hanging_weaved',
  'xp_furniture:big_flower_pot_hanging_wooden',
  'xp_furniture:big_flower_pot_normal_dark_green',
  'xp_furniture:big_flower_pot_normal_decorated',
  'xp_furniture:big_flower_pot_normal_dotted',
  'xp_furniture:big_flower_pot_normal_lined',
  'xp_furniture:big_flower_pot_normal_plain',
  'xp_furniture:big_flower_pot_normal_weaved',
  'xp_furniture:big_flower_pot_normal_wooden',
  'xp_furniture:brick_planter_box',
  'xp_furniture:clay_planter_box',
  'xp_furniture:fancy_clay_planter_box',
  'xp_furniture:oak_planter_box',
  'xp_furniture:spruce_planter_box',
  'xp_furniture:stone_planter_box',
  'xp_furniture:display_case',
  'xp_furniture:display_case_fancy',
  'xp_furniture:juice_barrel',
  'xp_furniture:juice_barrel_v2',
  'xp_furniture:large_wooden_cart',
  'xp_furniture:small_wooden_cart',
  'xp_furniture:apple',
  'xp_furniture:baked_potato',
  'xp_furniture:beetroot_soup',
  'xp_furniture:bow_with_arrow',
  'xp_furniture:bow',
  'xp_furniture:bunch_of_carrots',
  'xp_furniture:clock',
  'xp_furniture:compass',
  'xp_furniture:cooked_beef',
  'xp_furniture:cooked_chicken',
  'xp_furniture:cooked_rabbit',
  'xp_furniture:cookie',
  'xp_furniture:crossbow',
  'xp_furniture:emerald',
  'xp_furniture:ender_eye',
  'xp_furniture:ender_pearl',
  'xp_furniture:fishing_rod',
  'xp_furniture:golden_apple',
  'xp_furniture:mushroom_stew',
  'xp_furniture:pufferfish',
  'xp_furniture:pumpkin_pie',
  'xp_furniture:quiver',
  'xp_furniture:rabbit_stew',
  'xp_furniture:salmon',
  'xp_furniture:totem_of_undying',
  'xp_furniture:uncooked_beef',
  'xp_furniture:uncooked_chicken',
  'xp_furniture:uncooked_rabbit',
  'xp_furniture:bricks_path',
  'xp_furniture:planks_path',
  'xp_furniture:stone_bricks_path',
  'xp_furniture:mossy_pebbles',
  'xp_furniture:pebbles',
  'xp_furniture:acacia_shelf',
  'xp_furniture:bamboo_shelf',
  'xp_furniture:birch_shelf',
  'xp_furniture:cherry_shelf',
  'xp_furniture:crimson_shelf',
  'xp_furniture:dark_oak_shelf',
  'xp_furniture:jungle_shelf',
  'xp_furniture:mangrove_shelf',
  'xp_furniture:oak_shelf',
  'xp_furniture:spruce_shelf',
  'xp_furniture:warped_shelf',
  'xp_furniture:pale_oak_shelf',
  'xp_furniture:copper_roof_glass',
  'xp_furniture:dark_roof_glass',
  'xp_furniture:white_roof_glass',
  'xp_furniture:wooden_picture_frame',
  'xp_furniture:wooden_picture_frame_banana',
  'xp_furniture:wooden_picture_frame_bedroom',
  'xp_furniture:wooden_picture_frame_capybara',
  'xp_furniture:wooden_picture_frame_cat',
  'xp_furniture:wooden_picture_frame_desert',
  'xp_furniture:wooden_picture_frame_house',
  'xp_furniture:wooden_picture_frame_mountain',
  'xp_furniture:wooden_picture_frame_sighting',
  'xp_furniture:wooden_picture_frame_sunset',
  'xp_furniture:wooden_picture_frame_tunnel',
  'xp_furniture:bongos',
  'xp_furniture:harp',
  'xp_furniture:ukulele',
  'xp_furniture:panflute',
  'xp_furniture:watering_can',
  'xp_furniture:watering_can_empty',
  'xp_dl:candle.white.block.block',
  'xp_dl:candle.light_gray.block',
  'xp_dl:candle.gray.block',
  'xp_dl:candle.black.block',
  'xp_dl:candle.brown.block',
  'xp_dl:candle.red.block',
  'xp_dl:candle.orange.block',
  'xp_dl:candle.yellow.block',
  'xp_dl:candle.lime.block',
  'xp_dl:candle.green.block',
  'xp_dl:candle.cyan.block',
  'xp_dl:candle.light_blue.block',
  'xp_dl:candle.blue.block',
  'xp_dl:candle.purple.block',
  'xp_dl:candle.magenta.block',
  'xp_dl:candle.pink.block',
  'xp_dl:latern.white.block.block',
  'xp_dl:latern.light_gray.block',
  'xp_dl:latern.gray.block',
  'xp_dl:latern.black.block',
  'xp_dl:latern.brown.block',
  'xp_dl:latern.red.block',
  'xp_dl:latern.orange.block',
  'xp_dl:latern.yellow.block',
  'xp_dl:latern.lime.block',
  'xp_dl:latern.green.block',
  'xp_dl:latern.cyan.block',
  'xp_dl:latern.light_blue.block',
  'xp_dl:latern.blue.block',
  'xp_dl:latern.purple.block',
  'xp_dl:latern.magenta.block',
  'xp_dl:latern.pink.block',
  'xp_dl:torch.white.block',
  'xp_dl:torch.light_gray.block',
  'xp_dl:torch.gray.block',
  'xp_dl:torch.black.block',
  'xp_dl:torch.brown.block',
  'xp_dl:torch.red.block',
  'xp_dl:torch.orange.block',
  'xp_dl:torch.yellow.block',
  'xp_dl:torch.lime.block',
  'xp_dl:torch.green.block',
  'xp_dl:torch.cyan.block',
  'xp_dl:torch.light_blue.block',
  'xp_dl:torch.blue.block',
  'xp_dl:torch.purple.block',
  'xp_dl:torch.magenta.block',
  'xp_dl:torch.pink.block',
  'xp_furniture:acacia_sideboard',
  'xp_furniture:bamboo_sideboard',
  'xp_furniture:birch_sideboard',
  'xp_furniture:cherry_sideboard',
  'xp_furniture:crimson_sideboard',
  'xp_furniture:dark_oak_sideboard',
  'xp_furniture:jungle_sideboard',
  'xp_furniture:mangrove_sideboard',
  'xp_furniture:oak_sideboard',
  'xp_furniture:spruce_sideboard',
  'xp_furniture:warped_sideboard',
  'xp_furniture:pale_oak_sideboard',
];
var mi = {
  format_version: [1, 1, 0],
  'xp_furniture:black_armchair': { sound: 'wood' },
  'xp_furniture:blue_armchair': { sound: 'wood' },
  'xp_furniture:brown_armchair': { sound: 'wood' },
  'xp_furniture:cyan_armchair': { sound: 'wood' },
  'xp_furniture:gray_armchair': { sound: 'wood' },
  'xp_furniture:green_armchair': { sound: 'wood' },
  'xp_furniture:light_blue_armchair': { sound: 'wood' },
  'xp_furniture:light_gray_armchair': { sound: 'wood' },
  'xp_furniture:lime_armchair': { sound: 'wood' },
  'xp_furniture:magenta_armchair': { sound: 'wood' },
  'xp_furniture:orange_armchair': { sound: 'wood' },
  'xp_furniture:pink_armchair': { sound: 'wood' },
  'xp_furniture:purple_armchair': { sound: 'wood' },
  'xp_furniture:red_armchair': { sound: 'wood' },
  'xp_furniture:white_armchair': { sound: 'wood' },
  'xp_furniture:yellow_armchair': { sound: 'wood' },
  'xp_furniture:acacia_beam': { sound: 'wood' },
  'xp_furniture:bamboo_beam': { sound: 'bamboo_wood' },
  'xp_furniture:birch_beam': { sound: 'wood' },
  'xp_furniture:cherry_beam': { sound: 'cherry_wood' },
  'xp_furniture:crimson_beam': { sound: 'wood' },
  'xp_furniture:dark_oak_beam': { sound: 'wood' },
  'xp_furniture:jungle_beam': { sound: 'wood' },
  'xp_furniture:mangrove_beam': { sound: 'wood' },
  'xp_furniture:oak_beam': { sound: 'wood' },
  'xp_furniture:spruce_beam': { sound: 'wood' },
  'xp_furniture:warped_beam': { sound: 'wood' },
  'xp_furniture:pale_oak_beam': { sound: 'wood' },
  'xp_furniture:black_acacia_queen_bed': { sound: 'wood' },
  'xp_furniture:blue_acacia_queen_bed': { sound: 'wood' },
  'xp_furniture:brown_acacia_queen_bed': { sound: 'wood' },
  'xp_furniture:cyan_acacia_queen_bed': { sound: 'wood' },
  'xp_furniture:gray_acacia_queen_bed': { sound: 'wood' },
  'xp_furniture:green_acacia_queen_bed': { sound: 'wood' },
  'xp_furniture:light_blue_acacia_queen_bed': { sound: 'wood' },
  'xp_furniture:light_gray_acacia_queen_bed': { sound: 'wood' },
  'xp_furniture:lime_acacia_queen_bed': { sound: 'wood' },
  'xp_furniture:magenta_acacia_queen_bed': { sound: 'wood' },
  'xp_furniture:orange_acacia_queen_bed': { sound: 'wood' },
  'xp_furniture:pink_acacia_queen_bed': { sound: 'wood' },
  'xp_furniture:purple_acacia_queen_bed': { sound: 'wood' },
  'xp_furniture:red_acacia_queen_bed': { sound: 'wood' },
  'xp_furniture:white_acacia_queen_bed': { sound: 'wood' },
  'xp_furniture:yellow_acacia_queen_bed': { sound: 'wood' },
  'xp_furniture:black_bamboo_queen_bed': { sound: 'wood' },
  'xp_furniture:blue_bamboo_queen_bed': { sound: 'wood' },
  'xp_furniture:brown_bamboo_queen_bed': { sound: 'wood' },
  'xp_furniture:cyan_bamboo_queen_bed': { sound: 'wood' },
  'xp_furniture:gray_bamboo_queen_bed': { sound: 'wood' },
  'xp_furniture:green_bamboo_queen_bed': { sound: 'wood' },
  'xp_furniture:light_blue_bamboo_queen_bed': { sound: 'wood' },
  'xp_furniture:light_gray_bamboo_queen_bed': { sound: 'wood' },
  'xp_furniture:lime_bamboo_queen_bed': { sound: 'wood' },
  'xp_furniture:magenta_bamboo_queen_bed': { sound: 'wood' },
  'xp_furniture:orange_bamboo_queen_bed': { sound: 'wood' },
  'xp_furniture:pink_bamboo_queen_bed': { sound: 'wood' },
  'xp_furniture:purple_bamboo_queen_bed': { sound: 'wood' },
  'xp_furniture:red_bamboo_queen_bed': { sound: 'wood' },
  'xp_furniture:white_bamboo_queen_bed': { sound: 'wood' },
  'xp_furniture:yellow_bamboo_queen_bed': { sound: 'wood' },
  'xp_furniture:black_birch_queen_bed': { sound: 'wood' },
  'xp_furniture:blue_birch_queen_bed': { sound: 'wood' },
  'xp_furniture:brown_birch_queen_bed': { sound: 'wood' },
  'xp_furniture:cyan_birch_queen_bed': { sound: 'wood' },
  'xp_furniture:gray_birch_queen_bed': { sound: 'wood' },
  'xp_furniture:green_birch_queen_bed': { sound: 'wood' },
  'xp_furniture:light_blue_birch_queen_bed': { sound: 'wood' },
  'xp_furniture:light_gray_birch_queen_bed': { sound: 'wood' },
  'xp_furniture:lime_birch_queen_bed': { sound: 'wood' },
  'xp_furniture:magenta_birch_queen_bed': { sound: 'wood' },
  'xp_furniture:orange_birch_queen_bed': { sound: 'wood' },
  'xp_furniture:pink_birch_queen_bed': { sound: 'wood' },
  'xp_furniture:purple_birch_queen_bed': { sound: 'wood' },
  'xp_furniture:red_birch_queen_bed': { sound: 'wood' },
  'xp_furniture:white_birch_queen_bed': { sound: 'wood' },
  'xp_furniture:yellow_birch_queen_bed': { sound: 'wood' },
  'xp_furniture:black_cherry_queen_bed': { sound: 'wood' },
  'xp_furniture:blue_cherry_queen_bed': { sound: 'wood' },
  'xp_furniture:brown_cherry_queen_bed': { sound: 'wood' },
  'xp_furniture:cyan_cherry_queen_bed': { sound: 'wood' },
  'xp_furniture:gray_cherry_queen_bed': { sound: 'wood' },
  'xp_furniture:green_cherry_queen_bed': { sound: 'wood' },
  'xp_furniture:light_blue_cherry_queen_bed': { sound: 'wood' },
  'xp_furniture:light_gray_cherry_queen_bed': { sound: 'wood' },
  'xp_furniture:lime_cherry_queen_bed': { sound: 'wood' },
  'xp_furniture:magenta_cherry_queen_bed': { sound: 'wood' },
  'xp_furniture:orange_cherry_queen_bed': { sound: 'wood' },
  'xp_furniture:pink_cherry_queen_bed': { sound: 'wood' },
  'xp_furniture:purple_cherry_queen_bed': { sound: 'wood' },
  'xp_furniture:red_cherry_queen_bed': { sound: 'wood' },
  'xp_furniture:white_cherry_queen_bed': { sound: 'wood' },
  'xp_furniture:yellow_cherry_queen_bed': { sound: 'wood' },
  'xp_furniture:black_crimson_queen_bed': { sound: 'wood' },
  'xp_furniture:blue_crimson_queen_bed': { sound: 'wood' },
  'xp_furniture:brown_crimson_queen_bed': { sound: 'wood' },
  'xp_furniture:cyan_crimson_queen_bed': { sound: 'wood' },
  'xp_furniture:gray_crimson_queen_bed': { sound: 'wood' },
  'xp_furniture:green_crimson_queen_bed': { sound: 'wood' },
  'xp_furniture:light_blue_crimson_queen_bed': { sound: 'wood' },
  'xp_furniture:light_gray_crimson_queen_bed': { sound: 'wood' },
  'xp_furniture:lime_crimson_queen_bed': { sound: 'wood' },
  'xp_furniture:magenta_crimson_queen_bed': { sound: 'wood' },
  'xp_furniture:orange_crimson_queen_bed': { sound: 'wood' },
  'xp_furniture:pink_crimson_queen_bed': { sound: 'wood' },
  'xp_furniture:purple_crimson_queen_bed': { sound: 'wood' },
  'xp_furniture:red_crimson_queen_bed': { sound: 'wood' },
  'xp_furniture:white_crimson_queen_bed': { sound: 'wood' },
  'xp_furniture:yellow_crimson_queen_bed': { sound: 'wood' },
  'xp_furniture:black_dark_oak_queen_bed': { sound: 'wood' },
  'xp_furniture:blue_dark_oak_queen_bed': { sound: 'wood' },
  'xp_furniture:brown_dark_oak_queen_bed': { sound: 'wood' },
  'xp_furniture:cyan_dark_oak_queen_bed': { sound: 'wood' },
  'xp_furniture:gray_dark_oak_queen_bed': { sound: 'wood' },
  'xp_furniture:green_dark_oak_queen_bed': { sound: 'wood' },
  'xp_furniture:light_blue_dark_oak_queen_bed': { sound: 'wood' },
  'xp_furniture:light_gray_dark_oak_queen_bed': { sound: 'wood' },
  'xp_furniture:lime_dark_oak_queen_bed': { sound: 'wood' },
  'xp_furniture:magenta_dark_oak_queen_bed': { sound: 'wood' },
  'xp_furniture:orange_dark_oak_queen_bed': { sound: 'wood' },
  'xp_furniture:pink_dark_oak_queen_bed': { sound: 'wood' },
  'xp_furniture:purple_dark_oak_queen_bed': { sound: 'wood' },
  'xp_furniture:red_dark_oak_queen_bed': { sound: 'wood' },
  'xp_furniture:white_dark_oak_queen_bed': { sound: 'wood' },
  'xp_furniture:yellow_dark_oak_queen_bed': { sound: 'wood' },
  'xp_furniture:black_jungle_queen_bed': { sound: 'wood' },
  'xp_furniture:blue_jungle_queen_bed': { sound: 'wood' },
  'xp_furniture:brown_jungle_queen_bed': { sound: 'wood' },
  'xp_furniture:cyan_jungle_queen_bed': { sound: 'wood' },
  'xp_furniture:gray_jungle_queen_bed': { sound: 'wood' },
  'xp_furniture:green_jungle_queen_bed': { sound: 'wood' },
  'xp_furniture:light_blue_jungle_queen_bed': { sound: 'wood' },
  'xp_furniture:light_gray_jungle_queen_bed': { sound: 'wood' },
  'xp_furniture:lime_jungle_queen_bed': { sound: 'wood' },
  'xp_furniture:magenta_jungle_queen_bed': { sound: 'wood' },
  'xp_furniture:orange_jungle_queen_bed': { sound: 'wood' },
  'xp_furniture:pink_jungle_queen_bed': { sound: 'wood' },
  'xp_furniture:purple_jungle_queen_bed': { sound: 'wood' },
  'xp_furniture:red_jungle_queen_bed': { sound: 'wood' },
  'xp_furniture:white_jungle_queen_bed': { sound: 'wood' },
  'xp_furniture:yellow_jungle_queen_bed': { sound: 'wood' },
  'xp_furniture:black_mangrove_queen_bed': { sound: 'wood' },
  'xp_furniture:blue_mangrove_queen_bed': { sound: 'wood' },
  'xp_furniture:brown_mangrove_queen_bed': { sound: 'wood' },
  'xp_furniture:cyan_mangrove_queen_bed': { sound: 'wood' },
  'xp_furniture:gray_mangrove_queen_bed': { sound: 'wood' },
  'xp_furniture:green_mangrove_queen_bed': { sound: 'wood' },
  'xp_furniture:light_blue_mangrove_queen_bed': { sound: 'wood' },
  'xp_furniture:light_gray_mangrove_queen_bed': { sound: 'wood' },
  'xp_furniture:lime_mangrove_queen_bed': { sound: 'wood' },
  'xp_furniture:magenta_mangrove_queen_bed': { sound: 'wood' },
  'xp_furniture:orange_mangrove_queen_bed': { sound: 'wood' },
  'xp_furniture:pink_mangrove_queen_bed': { sound: 'wood' },
  'xp_furniture:purple_mangrove_queen_bed': { sound: 'wood' },
  'xp_furniture:red_mangrove_queen_bed': { sound: 'wood' },
  'xp_furniture:white_mangrove_queen_bed': { sound: 'wood' },
  'xp_furniture:yellow_mangrove_queen_bed': { sound: 'wood' },
  'xp_furniture:black_oak_queen_bed': { sound: 'wood' },
  'xp_furniture:blue_oak_queen_bed': { sound: 'wood' },
  'xp_furniture:brown_oak_queen_bed': { sound: 'wood' },
  'xp_furniture:cyan_oak_queen_bed': { sound: 'wood' },
  'xp_furniture:gray_oak_queen_bed': { sound: 'wood' },
  'xp_furniture:green_oak_queen_bed': { sound: 'wood' },
  'xp_furniture:light_blue_oak_queen_bed': { sound: 'wood' },
  'xp_furniture:light_gray_oak_queen_bed': { sound: 'wood' },
  'xp_furniture:lime_oak_queen_bed': { sound: 'wood' },
  'xp_furniture:magenta_oak_queen_bed': { sound: 'wood' },
  'xp_furniture:orange_oak_queen_bed': { sound: 'wood' },
  'xp_furniture:pink_oak_queen_bed': { sound: 'wood' },
  'xp_furniture:purple_oak_queen_bed': { sound: 'wood' },
  'xp_furniture:red_oak_queen_bed': { sound: 'wood' },
  'xp_furniture:white_oak_queen_bed': { sound: 'wood' },
  'xp_furniture:yellow_oak_queen_bed': { sound: 'wood' },
  'xp_furniture:black_spruce_queen_bed': { sound: 'wood' },
  'xp_furniture:blue_spruce_queen_bed': { sound: 'wood' },
  'xp_furniture:brown_spruce_queen_bed': { sound: 'wood' },
  'xp_furniture:cyan_spruce_queen_bed': { sound: 'wood' },
  'xp_furniture:gray_spruce_queen_bed': { sound: 'wood' },
  'xp_furniture:green_spruce_queen_bed': { sound: 'wood' },
  'xp_furniture:light_blue_spruce_queen_bed': { sound: 'wood' },
  'xp_furniture:light_gray_spruce_queen_bed': { sound: 'wood' },
  'xp_furniture:lime_spruce_queen_bed': { sound: 'wood' },
  'xp_furniture:magenta_spruce_queen_bed': { sound: 'wood' },
  'xp_furniture:orange_spruce_queen_bed': { sound: 'wood' },
  'xp_furniture:pink_spruce_queen_bed': { sound: 'wood' },
  'xp_furniture:purple_spruce_queen_bed': { sound: 'wood' },
  'xp_furniture:red_spruce_queen_bed': { sound: 'wood' },
  'xp_furniture:white_spruce_queen_bed': { sound: 'wood' },
  'xp_furniture:yellow_spruce_queen_bed': { sound: 'wood' },
  'xp_furniture:black_warped_queen_bed': { sound: 'wood' },
  'xp_furniture:blue_warped_queen_bed': { sound: 'wood' },
  'xp_furniture:brown_warped_queen_bed': { sound: 'wood' },
  'xp_furniture:cyan_warped_queen_bed': { sound: 'wood' },
  'xp_furniture:gray_warped_queen_bed': { sound: 'wood' },
  'xp_furniture:green_warped_queen_bed': { sound: 'wood' },
  'xp_furniture:light_blue_warped_queen_bed': { sound: 'wood' },
  'xp_furniture:light_gray_warped_queen_bed': { sound: 'wood' },
  'xp_furniture:lime_warped_queen_bed': { sound: 'wood' },
  'xp_furniture:magenta_warped_queen_bed': { sound: 'wood' },
  'xp_furniture:orange_warped_queen_bed': { sound: 'wood' },
  'xp_furniture:pink_warped_queen_bed': { sound: 'wood' },
  'xp_furniture:purple_warped_queen_bed': { sound: 'wood' },
  'xp_furniture:red_warped_queen_bed': { sound: 'wood' },
  'xp_furniture:white_warped_queen_bed': { sound: 'wood' },
  'xp_furniture:yellow_warped_queen_bed': { sound: 'wood' },
  'xp_furniture:black_pale_oak_queen_bed': { sound: 'wood' },
  'xp_furniture:blue_pale_oak_queen_bed': { sound: 'wood' },
  'xp_furniture:brown_pale_oak_queen_bed': { sound: 'wood' },
  'xp_furniture:cyan_pale_oak_queen_bed': { sound: 'wood' },
  'xp_furniture:gray_pale_oak_queen_bed': { sound: 'wood' },
  'xp_furniture:green_pale_oak_queen_bed': { sound: 'wood' },
  'xp_furniture:light_blue_pale_oak_queen_bed': { sound: 'wood' },
  'xp_furniture:light_gray_pale_oak_queen_bed': { sound: 'wood' },
  'xp_furniture:lime_pale_oak_queen_bed': { sound: 'wood' },
  'xp_furniture:magenta_pale_oak_queen_bed': { sound: 'wood' },
  'xp_furniture:orange_pale_oak_queen_bed': { sound: 'wood' },
  'xp_furniture:pink_pale_oak_queen_bed': { sound: 'wood' },
  'xp_furniture:purple_pale_oak_queen_bed': { sound: 'wood' },
  'xp_furniture:red_pale_oak_queen_bed': { sound: 'wood' },
  'xp_furniture:white_pale_oak_queen_bed': { sound: 'wood' },
  'xp_furniture:yellow_pale_oak_queen_bed': { sound: 'wood' },
  'xp_furniture:acacia_bench': { sound: 'wood' },
  'xp_furniture:bamboo_bench': { sound: 'bamboo_wood' },
  'xp_furniture:birch_bench': { sound: 'wood' },
  'xp_furniture:cherry_bench': { sound: 'cherry_wood' },
  'xp_furniture:crimson_bench': { sound: 'wood' },
  'xp_furniture:dark_oak_bench': { sound: 'wood' },
  'xp_furniture:jungle_bench': { sound: 'wood' },
  'xp_furniture:mangrove_bench': { sound: 'wood' },
  'xp_furniture:oak_bench': { sound: 'wood' },
  'xp_furniture:spruce_bench': { sound: 'wood' },
  'xp_furniture:warped_bench': { sound: 'wood' },
  'xp_furniture:pale_oak_bench': { sound: 'wood' },
  'xp_furniture:carpet_blue': { sound: 'cloth' },
  'xp_furniture:carpet_lavender': { sound: 'cloth' },
  'xp_furniture:carpet_red': { sound: 'cloth' },
  'xp_furniture:carpet_lime': { sound: 'cloth' },
  'xp_furniture:carpet_black': { sound: 'cloth' },
  'xp_furniture:carpet_grey': { sound: 'cloth' },
  'xp_furniture:carpet_purple': { sound: 'cloth' },
  'xp_furniture:carpet_white': { sound: 'cloth' },
  'xp_furniture:acacia_doorframe': { sound: 'wood' },
  'xp_furniture:bamboo_doorframe': { sound: 'bamboo_wood' },
  'xp_furniture:birch_doorframe': { sound: 'wood' },
  'xp_furniture:cherry_doorframe': { sound: 'cherry_wood' },
  'xp_furniture:crimson_doorframe': { sound: 'wood' },
  'xp_furniture:dark_oak_doorframe': { sound: 'wood' },
  'xp_furniture:jungle_doorframe': { sound: 'wood' },
  'xp_furniture:mangrove_doorframe': { sound: 'wood' },
  'xp_furniture:oak_doorframe': { sound: 'wood' },
  'xp_furniture:spruce_doorframe': { sound: 'wood' },
  'xp_furniture:warped_doorframe': { sound: 'wood' },
  'xp_furniture:pale_oak_doorframe': { sound: 'wood' },
  'xp_furniture:acacia_double_doorframe': { sound: 'wood' },
  'xp_furniture:bamboo_double_doorframe': { sound: 'bamboo_wood' },
  'xp_furniture:birch_double_doorframe': { sound: 'wood' },
  'xp_furniture:cherry_double_doorframe': { sound: 'cherry_wood' },
  'xp_furniture:crimson_double_doorframe': { sound: 'wood' },
  'xp_furniture:dark_oak_double_doorframe': { sound: 'wood' },
  'xp_furniture:jungle_double_doorframe': { sound: 'wood' },
  'xp_furniture:mangrove_double_doorframe': { sound: 'wood' },
  'xp_furniture:oak_double_doorframe': { sound: 'wood' },
  'xp_furniture:spruce_double_doorframe': { sound: 'wood' },
  'xp_furniture:warped_double_doorframe': { sound: 'wood' },
  'xp_furniture:black_sofa': { sound: 'wood' },
  'xp_furniture:blue_sofa': { sound: 'wood' },
  'xp_furniture:brown_sofa': { sound: 'wood' },
  'xp_furniture:cyan_sofa': { sound: 'wood' },
  'xp_furniture:gray_sofa': { sound: 'wood' },
  'xp_furniture:green_sofa': { sound: 'wood' },
  'xp_furniture:light_blue_sofa': { sound: 'wood' },
  'xp_furniture:light_gray_sofa': { sound: 'wood' },
  'xp_furniture:lime_sofa': { sound: 'wood' },
  'xp_furniture:magenta_sofa': { sound: 'wood' },
  'xp_furniture:orange_sofa': { sound: 'wood' },
  'xp_furniture:pink_sofa': { sound: 'wood' },
  'xp_furniture:purple_sofa': { sound: 'wood' },
  'xp_furniture:red_sofa': { sound: 'wood' },
  'xp_furniture:white_sofa': { sound: 'wood' },
  'xp_furniture:yellow_sofa': { sound: 'wood' },
  'xp_furniture:acacia_side_table': { sound: 'wood' },
  'xp_furniture:bamboo_side_table': { sound: 'bamboo_wood' },
  'xp_furniture:birch_side_table': { sound: 'wood' },
  'xp_furniture:cherry_side_table': { sound: 'cherry_wood' },
  'xp_furniture:crimson_side_table': { sound: 'wood' },
  'xp_furniture:dark_oak_side_table': { sound: 'wood' },
  'xp_furniture:jungle_side_table': { sound: 'wood' },
  'xp_furniture:mangrove_side_table': { sound: 'wood' },
  'xp_furniture:oak_side_table': { sound: 'wood' },
  'xp_furniture:spruce_side_table': { sound: 'wood' },
  'xp_furniture:warped_side_table': { sound: 'wood' },
  'xp_furniture:pale_oak_side_table': { sound: 'wood' },
  'xp_furniture:big_acacia_table': { sound: 'wood' },
  'xp_furniture:big_bamboo_table': { sound: 'bamboo_wood' },
  'xp_furniture:big_birch_table': { sound: 'wood' },
  'xp_furniture:big_cherry_table': { sound: 'wood' },
  'xp_furniture:big_crimson_table': { sound: 'wood' },
  'xp_furniture:big_dark_oak_table': { sound: 'wood' },
  'xp_furniture:big_jungle_table': { sound: 'wood' },
  'xp_furniture:big_mangrove_table': { sound: 'wood' },
  'xp_furniture:big_oak_table': { sound: 'wood' },
  'xp_furniture:big_spruce_table': { sound: 'wood' },
  'xp_furniture:big_warped_table': { sound: 'wood' },
  'xp_furniture:big_pale_oak_table': { sound: 'wood' },
  'xp_furniture:medium_acacia_table': { sound: 'wood' },
  'xp_furniture:medium_bamboo_table': { sound: 'bamboo_wood' },
  'xp_furniture:medium_birch_table': { sound: 'wood' },
  'xp_furniture:medium_cherry_table': { sound: 'wood' },
  'xp_furniture:medium_crimson_table': { sound: 'wood' },
  'xp_furniture:medium_dark_oak_table': { sound: 'wood' },
  'xp_furniture:medium_jungle_table': { sound: 'wood' },
  'xp_furniture:medium_mangrove_table': { sound: 'wood' },
  'xp_furniture:medium_oak_table': { sound: 'wood' },
  'xp_furniture:medium_spruce_table': { sound: 'wood' },
  'xp_furniture:medium_warped_table': { sound: 'wood' },
  'xp_furniture:medium_pale_oak_table': { sound: 'wood' },
  'xp_furniture:small_acacia_table': { sound: 'wood' },
  'xp_furniture:small_bamboo_table': { sound: 'bamboo_wood' },
  'xp_furniture:small_birch_table': { sound: 'wood' },
  'xp_furniture:small_cherry_table': { sound: 'wood' },
  'xp_furniture:small_crimson_table': { sound: 'wood' },
  'xp_furniture:small_dark_oak_table': { sound: 'wood' },
  'xp_furniture:small_jungle_table': { sound: 'wood' },
  'xp_furniture:small_mangrove_table': { sound: 'wood' },
  'xp_furniture:small_oak_table': { sound: 'wood' },
  'xp_furniture:small_spruce_table': { sound: 'wood' },
  'xp_furniture:small_warped_table': { sound: 'wood' },
  'xp_furniture:small_pale_oak_table': { sound: 'wood' },
  'xp_furniture:acacia_gate': { sound: 'wood' },
  'xp_furniture:bamboo_gate': { sound: 'bamboo_wood' },
  'xp_furniture:birch_gate': { sound: 'wood' },
  'xp_furniture:cherry_gate': { sound: 'cherry_wood' },
  'xp_furniture:crimson_gate': { sound: 'wood' },
  'xp_furniture:dark_oak_gate': { sound: 'wood' },
  'xp_furniture:jungle_gate': { sound: 'wood' },
  'xp_furniture:mangrove_gate': { sound: 'wood' },
  'xp_furniture:oak_gate': { sound: 'wood' },
  'xp_furniture:spruce_gate': { sound: 'wood' },
  'xp_furniture:warped_gate': { sound: 'wood' },
  'xp_furniture:pale_oak_gate': { sound: 'wood' },
  'xp_furniture:oak_fence': { sound: 'wood' },
  'xp_furniture:oak_fence_v2': { sound: 'wood' },
  'xp_furniture:spruce_fence': { sound: 'wood' },
  'xp_furniture:spruce_fence_v2': { sound: 'wood' },
  'xp_furniture:birch_fence': { sound: 'wood' },
  'xp_furniture:birch_fence_v2': { sound: 'wood' },
  'xp_furniture:jungle_fence': { sound: 'wood' },
  'xp_furniture:jungle_fence_v2': { sound: 'wood' },
  'xp_furniture:acacia_fence': { sound: 'wood' },
  'xp_furniture:acacia_fence_v2': { sound: 'wood' },
  'xp_furniture:dark_oak_fence': { sound: 'wood' },
  'xp_furniture:dark_oak_fence_v2': { sound: 'wood' },
  'xp_furniture:mangrove_fence': { sound: 'wood' },
  'xp_furniture:mangrove_fence_v2': { sound: 'wood' },
  'xp_furniture:cherry_fence': { sound: 'cherry_wood' },
  'xp_furniture:cherry_fence_v2': { sound: 'cherry_wood' },
  'xp_furniture:pale_oak_fence': { sound: 'wood' },
  'xp_furniture:pale_oak_fence_v2': { sound: 'wood' },
  'xp_furniture:bamboo_fence': { sound: 'bamboo_wood' },
  'xp_furniture:bamboo_fence_v2': { sound: 'bamboo_wood' },
  'xp_furniture:crimson_fence': { sound: 'wood' },
  'xp_furniture:crimson_fence_v2': { sound: 'wood' },
  'xp_furniture:warped_fence': { sound: 'wood' },
  'xp_furniture:warped_fence_v2': { sound: 'wood' },
  'xp_furniture:empty_basket': { sound: 'wood' },
  'xp_furniture:apple_basket': { sound: 'wood' },
  'xp_furniture:carrot_basket': { sound: 'wood' },
  'xp_furniture:potato_basket': { sound: 'wood' },
  'xp_furniture:wisteria_leaves_hanging_top': { sound: 'grass' },
  'xp_furniture:wisteria_leaves_hanging_bottom': { sound: 'grass' },
  'xp_furniture:wisteria_leaves_hanging': { sound: 'grass' },
  'xp_furniture:wisteria_leaves': { sound: 'grass' },
  'xp_furniture:wisteria_leaves_full': {
    textures: 'xp_furniture:wisteria_leaves_full',
    sound: 'grass',
  },
  'xp_furniture:golden_chain_leaves_hanging_top': { sound: 'grass' },
  'xp_furniture:golden_chain_leaves_hanging_bottom': { sound: 'grass' },
  'xp_furniture:golden_chain_leaves_hanging': { sound: 'grass' },
  'xp_furniture:golden_chain_leaves': { sound: 'grass' },
  'xp_furniture:golden_chain_leaves_full': {
    textures: 'xp_furniture:golden_chain_leaves_full',
    sound: 'grass',
  },
  'xp_furniture:dog_wood_leaves': { sound: 'grass' },
  'xp_furniture:dog_wood_leaves_full': {
    textures: 'xp_furniture:dog_wood_leaves_full',
    sound: 'grass',
  },
  'xp_furniture:orange_acacia_leaves': { sound: 'grass' },
  'xp_furniture:orange_acacia_leaves_full': {
    textures: 'xp_furniture:orange_acacia_leaves_full',
    sound: 'grass',
  },
  'xp_furniture:willow_leaves_hanging_top': { sound: 'grass' },
  'xp_furniture:willow_leaves_hanging_bottom': { sound: 'grass' },
  'xp_furniture:willow_leaves_hanging': { sound: 'grass' },
  'xp_furniture:willow_leaves': { sound: 'grass' },
  'xp_furniture:willow_leaves_full': {
    textures: 'xp_furniture:willow_leaves_full',
    sound: 'grass',
  },
  'xp_furniture:yellow_birch_leaves': { sound: 'grass' },
  'xp_furniture:yellow_birch_leaves_full': {
    textures: 'xp_furniture:yellow_birch_leaves_full',
    sound: 'grass',
  },
  'xp_furniture:cattail': { sound: 'grass' },
  'xp_furniture:duckweed': { sound: 'grass' },
  'xp_furniture:lotus_lilypad_pink': { sound: 'grass' },
  'xp_furniture:lotus_lilypad_purple': { sound: 'grass' },
  'xp_furniture:lotus_lilypad_white': { sound: 'grass' },
  'xp_furniture:fallen_leaves': { sound: 'grass' },
  'xp_furniture:leaf_pile': { sound: 'grass' },
  'xp_furniture:big_spiky_plant': { sound: 'grass' },
  'xp_furniture:bush': { sound: 'grass' },
  'xp_furniture:fern': { sound: 'grass' },
  'xp_furniture:leafy_plant_0': { sound: 'grass' },
  'xp_furniture:leafy_plant_1': { sound: 'grass' },
  'xp_furniture:plant_monstera': { sound: 'grass' },
  'xp_furniture:succulent': { sound: 'grass' },
  'xp_furniture:small_azalea_tree': { sound: 'grass' },
  'xp_furniture:small_cactus_0': { sound: 'cloth' },
  'xp_furniture:small_cactus_1': { sound: 'cloth' },
  'xp_furniture:small_cactus_2': { sound: 'cloth' },
  'xp_furniture:corn_block': { sound: 'grass' },
  'xp_furniture:corn_block_top': { sound: 'grass' },
  'xp_furniture:cabbage_block': { sound: 'grass' },
  'xp_furniture:bell_pepper_block': { sound: 'grass' },
  'xp_furniture:eggplant_block': { sound: 'grass' },
  'xp_furniture:tomato_block': { sound: 'grass' },
  'xp_furniture:large_wooden_cart': { sound: 'wood' },
  'xp_furniture:small_wooden_cart': { sound: 'wood' },
  'xp_furniture:andesite_and_diorite': {
    textures: 'xp_furniture:andesite_and_diorite',
    sound: 'stone',
  },
  'xp_furniture:blackstone_and_diorite': {
    textures: 'xp_furniture:blackstone_and_diorite',
    sound: 'stone',
  },
  'xp_furniture:dark_prismarine_and_calcite_small': {
    textures: 'xp_furniture:dark_prismarine_and_calcite_small',
    sound: 'stone',
  },
  'xp_furniture:dark_prismarine_and_calcite': {
    textures: 'xp_furniture:dark_prismarine_and_calcite',
    sound: 'stone',
  },
  'xp_furniture:granite_and_andesite_small': {
    textures: 'xp_furniture:granite_and_andesite_small',
    sound: 'stone',
  },
  'xp_furniture:granite_and_andesite': {
    textures: 'xp_furniture:granite_and_andesite',
    sound: 'stone',
  },
  'xp_furniture:granite_and_bricks': {
    textures: 'xp_furniture:granite_and_bricks',
    sound: 'stone',
  },
  'xp_furniture:granite_and_diorite': {
    textures: 'xp_furniture:granite_and_diorite',
    sound: 'stone',
  },
  'xp_furniture:prismarine_and_andesite': {
    textures: 'xp_furniture:prismarine_and_andesite',
    sound: 'stone',
  },
  'xp_furniture:prismarine_and_dark_prismarine': {
    textures: 'xp_furniture:prismarine_and_dark_prismarine',
    sound: 'stone',
  },
  'xp_furniture:acacia_bookshelf': { sound: 'wood' },
  'xp_furniture:bamboo_bookshelf': { sound: 'bamboo_wood' },
  'xp_furniture:birch_bookshelf': { sound: 'wood' },
  'xp_furniture:cherry_bookshelf': { sound: 'cherry_wood' },
  'xp_furniture:crimson_bookshelf': { sound: 'wood' },
  'xp_furniture:dark_oak_bookshelf': { sound: 'wood' },
  'xp_furniture:jungle_bookshelf': { sound: 'wood' },
  'xp_furniture:mangrove_bookshelf': { sound: 'wood' },
  'xp_furniture:spruce_bookshelf': { sound: 'wood' },
  'xp_furniture:warped_bookshelf': { sound: 'wood' },
  'xp_furniture:pale_oak_bookshelf': { sound: 'wood' },
  'xp_furniture:wooden_picture_frame': { sound: 'wood' },
  'xp_furniture:wooden_picture_frame_banana': { sound: 'wood' },
  'xp_furniture:wooden_picture_frame_bedroom': { sound: 'wood' },
  'xp_furniture:wooden_picture_frame_capybara': { sound: 'wood' },
  'xp_furniture:wooden_picture_frame_cat': { sound: 'wood' },
  'xp_furniture:wooden_picture_frame_desert': { sound: 'wood' },
  'xp_furniture:wooden_picture_frame_house': { sound: 'wood' },
  'xp_furniture:wooden_picture_frame_mountain': { sound: 'wood' },
  'xp_furniture:wooden_picture_frame_sighting': { sound: 'wood' },
  'xp_furniture:wooden_picture_frame_sunset': { sound: 'wood' },
  'xp_furniture:wooden_picture_frame_tunnel': { sound: 'wood' },
  'xp_furniture:wooden_picture_frame_crunch': { sound: 'wood' },
  'xp_furniture:wooden_picture_frame_moon': { sound: 'wood' },
  'xp_furniture:wooden_picture_frame_pumpkin': { sound: 'wood' },
  'xp_furniture:wooden_picture_frame_christmas_tree': { sound: 'wood' },
  'xp_furniture:wooden_picture_frame_reindeer': { sound: 'wood' },
  'xp_furniture:wooden_picture_frame_snowman': { sound: 'wood' },
  'xp_furniture:acacia_chiseled_planks': {
    textures: 'xp_furniture:acacia_chiseled_planks',
    sound: 'wood',
  },
  'xp_furniture:acacia_flat_planks': { textures: 'xp_furniture:acacia_flat_planks', sound: 'wood' },
  'xp_furniture:acacia_herringbone_planks': {
    textures: 'xp_furniture:acacia_herringbone_planks',
    sound: 'wood',
  },
  'xp_furniture:acacia_pattern_planks': {
    textures: 'xp_furniture:acacia_pattern_planks',
    sound: 'wood',
  },
  'xp_furniture:acacia_tiled_planks': {
    textures: 'xp_furniture:acacia_tiled_planks',
    sound: 'wood',
  },
  'xp_furniture:acacia_vertical_planks': {
    textures: 'xp_furniture:acacia_vertical_planks',
    sound: 'wood',
  },
  'xp_furniture:birch_chiseled_planks': {
    textures: 'xp_furniture:birch_chiseled_planks',
    sound: 'wood',
  },
  'xp_furniture:birch_flat_planks': { textures: 'xp_furniture:birch_flat_planks', sound: 'wood' },
  'xp_furniture:birch_herringbone_planks': {
    textures: 'xp_furniture:birch_herringbone_planks',
    sound: 'wood',
  },
  'xp_furniture:birch_pattern_planks': {
    textures: 'xp_furniture:birch_pattern_planks',
    sound: 'wood',
  },
  'xp_furniture:birch_tiled_planks': { textures: 'xp_furniture:birch_tiled_planks', sound: 'wood' },
  'xp_furniture:birch_vertical_planks': {
    textures: 'xp_furniture:birch_vertical_planks',
    sound: 'wood',
  },
  'xp_furniture:cherry_chiseled_planks': {
    textures: 'xp_furniture:cherry_chiseled_planks',
    sound: 'cherry_wood',
  },
  'xp_furniture:cherry_flat_planks': {
    textures: 'xp_furniture:cherry_flat_planks',
    sound: 'cherry_wood',
  },
  'xp_furniture:cherry_herringbone_planks': {
    textures: 'xp_furniture:cherry_herringbone_planks',
    sound: 'cherry_wood',
  },
  'xp_furniture:cherry_pattern_planks': {
    textures: 'xp_furniture:cherry_pattern_planks',
    sound: 'cherry_wood',
  },
  'xp_furniture:cherry_tiled_planks': {
    textures: 'xp_furniture:cherry_tiled_planks',
    sound: 'cherry_wood',
  },
  'xp_furniture:cherry_vertical_planks': {
    textures: 'xp_furniture:cherry_vertical_planks',
    sound: 'cherry_wood',
  },
  'xp_furniture:crimson_chiseled_planks': {
    textures: 'xp_furniture:crimson_chiseled_planks',
    sound: 'wood',
  },
  'xp_furniture:crimson_flat_planks': {
    textures: 'xp_furniture:crimson_flat_planks',
    sound: 'wood',
  },
  'xp_furniture:crimson_herringbone_planks': {
    textures: 'xp_furniture:crimson_herringbone_planks',
    sound: 'wood',
  },
  'xp_furniture:crimson_pattern_planks': {
    textures: 'xp_furniture:crimson_pattern_planks',
    sound: 'wood',
  },
  'xp_furniture:crimson_tiled_planks': {
    textures: 'xp_furniture:crimson_tiled_planks',
    sound: 'wood',
  },
  'xp_furniture:crimson_vertical_planks': {
    textures: 'xp_furniture:crimson_vertical_planks',
    sound: 'wood',
  },
  'xp_furniture:dark_oak_chiseled_planks': {
    textures: 'xp_furniture:dark_oak_chiseled_planks',
    sound: 'wood',
  },
  'xp_furniture:dark_oak_flat_planks': {
    textures: 'xp_furniture:dark_oak_flat_planks',
    sound: 'wood',
  },
  'xp_furniture:dark_oak_herringbone_planks': {
    textures: 'xp_furniture:dark_oak_herringbone_planks',
    sound: 'wood',
  },
  'xp_furniture:dark_oak_pattern_planks': {
    textures: 'xp_furniture:dark_oak_pattern_planks',
    sound: 'wood',
  },
  'xp_furniture:dark_oak_tiled_planks': {
    textures: 'xp_furniture:dark_oak_tiled_planks',
    sound: 'wood',
  },
  'xp_furniture:dark_oak_vertical_planks': {
    textures: 'xp_furniture:dark_oak_vertical_planks',
    sound: 'wood',
  },
  'xp_furniture:jungle_chiseled_planks': {
    textures: 'xp_furniture:jungle_chiseled_planks',
    sound: 'wood',
  },
  'xp_furniture:jungle_flat_planks': { textures: 'xp_furniture:jungle_flat_planks', sound: 'wood' },
  'xp_furniture:jungle_herringbone_planks': {
    textures: 'xp_furniture:jungle_herringbone_planks',
    sound: 'wood',
  },
  'xp_furniture:jungle_pattern_planks': {
    textures: 'xp_furniture:jungle_pattern_planks',
    sound: 'wood',
  },
  'xp_furniture:jungle_tiled_planks': {
    textures: 'xp_furniture:jungle_tiled_planks',
    sound: 'wood',
  },
  'xp_furniture:jungle_vertical_planks': {
    textures: 'xp_furniture:jungle_vertical_planks',
    sound: 'wood',
  },
  'xp_furniture:mangrove_chiseled_planks': {
    textures: 'xp_furniture:mangrove_chiseled_planks',
    sound: 'wood',
  },
  'xp_furniture:mangrove_flat_planks': {
    textures: 'xp_furniture:mangrove_flat_planks',
    sound: 'wood',
  },
  'xp_furniture:mangrove_herringbone_planks': {
    textures: 'xp_furniture:mangrove_herringbone_planks',
    sound: 'wood',
  },
  'xp_furniture:mangrove_pattern_planks': {
    textures: 'xp_furniture:mangrove_pattern_planks',
    sound: 'wood',
  },
  'xp_furniture:mangrove_tiled_planks': {
    textures: 'xp_furniture:mangrove_tiled_planks',
    sound: 'wood',
  },
  'xp_furniture:mangrove_vertical_planks': {
    textures: 'xp_furniture:mangrove_vertical_planks',
    sound: 'wood',
  },
  'xp_furniture:oak_chiseled_planks': {
    textures: 'xp_furniture:oak_chiseled_planks',
    sound: 'wood',
  },
  'xp_furniture:oak_flat_planks': { textures: 'xp_furniture:oak_flat_planks', sound: 'wood' },
  'xp_furniture:oak_herringbone_planks': {
    textures: 'xp_furniture:oak_herringbone_planks',
    sound: 'wood',
  },
  'xp_furniture:oak_pattern_planks': { textures: 'xp_furniture:oak_pattern_planks', sound: 'wood' },
  'xp_furniture:oak_tiled_planks': { textures: 'xp_furniture:oak_tiled_planks', sound: 'wood' },
  'xp_furniture:oak_vertical_planks': {
    textures: 'xp_furniture:oak_vertical_planks',
    sound: 'wood',
  },
  'xp_furniture:spruce_chiseled_planks': {
    textures: 'xp_furniture:spruce_chiseled_planks',
    sound: 'wood',
  },
  'xp_furniture:spruce_flat_planks': { textures: 'xp_furniture:spruce_flat_planks', sound: 'wood' },
  'xp_furniture:spruce_herringbone_planks': {
    textures: 'xp_furniture:spruce_herringbone_planks',
    sound: 'wood',
  },
  'xp_furniture:spruce_pattern_planks': {
    textures: 'xp_furniture:spruce_pattern_planks',
    sound: 'wood',
  },
  'xp_furniture:spruce_tiled_planks': {
    textures: 'xp_furniture:spruce_tiled_planks',
    sound: 'wood',
  },
  'xp_furniture:spruce_vertical_planks': {
    textures: 'xp_furniture:spruce_vertical_planks',
    sound: 'wood',
  },
  'xp_furniture:warped_chiseled_planks': {
    textures: 'xp_furniture:warped_chiseled_planks',
    sound: 'wood',
  },
  'xp_furniture:warped_flat_planks': { textures: 'xp_furniture:warped_flat_planks', sound: 'wood' },
  'xp_furniture:warped_herringbone_planks': {
    textures: 'xp_furniture:warped_herringbone_planks',
    sound: 'wood',
  },
  'xp_furniture:warped_pattern_planks': {
    textures: 'xp_furniture:warped_pattern_planks',
    sound: 'wood',
  },
  'xp_furniture:warped_tiled_planks': {
    textures: 'xp_furniture:warped_tiled_planks',
    sound: 'wood',
  },
  'xp_furniture:warped_vertical_planks': {
    textures: 'xp_furniture:warped_vertical_planks',
    sound: 'wood',
  },
  'xp_furniture:pale_oak_chiseled_planks': {
    textures: 'xp_furniture:pale_oak_chiseled_planks',
    sound: 'wood',
  },
  'xp_furniture:pale_oak_flat_planks': {
    textures: 'xp_furniture:pale_oak_flat_planks',
    sound: 'wood',
  },
  'xp_furniture:pale_oak_herringbone_planks': {
    textures: 'xp_furniture:pale_oak_herringbone_planks',
    sound: 'wood',
  },
  'xp_furniture:pale_oak_pattern_planks': {
    textures: 'xp_furniture:pale_oak_pattern_planks',
    sound: 'wood',
  },
  'xp_furniture:pale_oak_tiled_planks': {
    textures: 'xp_furniture:pale_oak_tiled_planks',
    sound: 'wood',
  },
  'xp_furniture:pale_oak_vertical_planks': {
    textures: 'xp_furniture:pale_oak_vertical_planks',
    sound: 'wood',
  },
  'xp_furniture:copper_roof_glass': { sound: 'glass' },
  'xp_furniture:dark_roof_glass': { sound: 'glass' },
  'xp_furniture:white_roof_glass': { sound: 'glass' },
  'xp_furniture:copper_roof': { sound: 'copper' },
  'xp_furniture:waxed_copper_roof': { sound: 'copper' },
  'xp_furniture:red_brick_roof': { sound: 'stone' },
  'xp_furniture:blackstone_roof': { sound: 'stone' },
  'xp_furniture:slate_roof': { sound: 'stone' },
  'xp_furniture:thatch_roof': { sound: 'grass' },
  'xp_furniture:mossy_roof': { sound: 'grass' },
  'xp_furniture:pink_umbrella': { sound: 'cloth' },
  'xp_furniture:red_umbrella': { sound: 'cloth' },
  'xp_furniture:white_umbrella': { sound: 'cloth' },
  'xp_furniture:brick_planter_box': { sound: 'stone' },
  'xp_furniture:clay_planter_box': { sound: 'stone' },
  'xp_furniture:fancy_clay_planter_box': { sound: 'stone' },
  'xp_furniture:stone_planter_box': { sound: 'stone' },
  'xp_furniture:acacia_sink': { sound: 'wood' },
  'xp_furniture:bamboo_sink': { sound: 'bamboo_wood' },
  'xp_furniture:birch_sink': { sound: 'wood' },
  'xp_furniture:cherry_sink': { sound: 'cherry_wood' },
  'xp_furniture:crimson_sink': { sound: 'wood' },
  'xp_furniture:dark_oak_sink': { sound: 'wood' },
  'xp_furniture:jungle_sink': { sound: 'wood' },
  'xp_furniture:mangrove_sink': { sound: 'wood' },
  'xp_furniture:oak_sink': { sound: 'wood' },
  'xp_furniture:spruce_sink': { sound: 'wood' },
  'xp_furniture:warped_sink': { sound: 'wood' },
  'xp_furniture:pale_oak_sink': { sound: 'wood' },
  'xp_furniture:acacia_support': { sound: 'wood' },
  'xp_furniture:bamboo_support': { sound: 'bamboo_wood' },
  'xp_furniture:birch_support': { sound: 'wood' },
  'xp_furniture:cherry_support': { sound: 'cherry_wood' },
  'xp_furniture:crimson_support': { sound: 'wood' },
  'xp_furniture:dark_oak_support': { sound: 'wood' },
  'xp_furniture:jungle_support': { sound: 'wood' },
  'xp_furniture:mangrove_support': { sound: 'wood' },
  'xp_furniture:oak_support': { sound: 'wood' },
  'xp_furniture:spruce_support': { sound: 'wood' },
  'xp_furniture:warped_support': { sound: 'wood' },
  'xp_furniture:pale_oak_support': { sound: 'wood' },
  'xp_furniture:oak_planter_box': { sound: 'wood' },
  'xp_furniture:spruce_planter_box': { sound: 'wood' },
  'xp_furniture:acacia_stairs': { sound: 'wood' },
  'xp_furniture:bamboo_stairs': { sound: 'bamboo_wood' },
  'xp_furniture:birch_stairs': { sound: 'wood' },
  'xp_furniture:cherry_stairs': { sound: 'cherry_wood' },
  'xp_furniture:crimson_stairs': { sound: 'wood' },
  'xp_furniture:dark_oak_stairs': { sound: 'wood' },
  'xp_furniture:jungle_stairs': { sound: 'wood' },
  'xp_furniture:mangrove_stairs': { sound: 'wood' },
  'xp_furniture:oak_stairs': { sound: 'wood' },
  'xp_furniture:spruce_stairs': { sound: 'wood' },
  'xp_furniture:warped_stairs': { sound: 'wood' },
  'xp_furniture:pale_oak_stairs': { sound: 'wood' },
  'xp_furniture:andesite_bricks': { textures: 'xp_furniture:andesite_bricks', sound: 'stone' },
  'xp_furniture:andesite_large_bricks': {
    textures: 'xp_furniture:andesite_large_bricks',
    sound: 'stone',
  },
  'xp_furniture:andesite_pillar': { sound: 'stone' },
  'xp_furniture:calcite_bricks': { textures: 'xp_furniture:calcite_bricks', sound: 'stone' },
  'xp_furniture:calcite_large_bricks': {
    textures: 'xp_furniture:calcite_large_bricks',
    sound: 'stone',
  },
  'xp_furniture:calcite_pillar': { sound: 'stone' },
  'xp_furniture:diorite_bricks': { textures: 'xp_furniture:diorite_bricks', sound: 'stone' },
  'xp_furniture:diorite_large_bricks': {
    textures: 'xp_furniture:diorite_large_bricks',
    sound: 'stone',
  },
  'xp_furniture:diorite_pillar': { sound: 'stone' },
  'xp_furniture:granite_bricks': { textures: 'xp_furniture:granite_bricks', sound: 'stone' },
  'xp_furniture:granite_large_bricks': {
    textures: 'xp_furniture:granite_large_bricks',
    sound: 'stone',
  },
  'xp_furniture:granite_pillar': { sound: 'stone' },
  'xp_furniture:chiseled_andesite': { textures: 'xp_furniture:chiseled_andesite', sound: 'stone' },
  'xp_furniture:polished_calcite': { textures: 'xp_furniture:polished_calcite', sound: 'calcite' },
  'xp_furniture:chiseled_calcite': { textures: 'xp_furniture:chiseled_calcite', sound: 'calcite' },
  'xp_furniture:chiseled_diorite': { textures: 'xp_furniture:chiseled_diorite', sound: 'stone' },
  'xp_furniture:chiseled_granite': { textures: 'xp_furniture:chiseled_granite', sound: 'stone' },
  'xp_furniture:decorated_black_wallpaper': {
    textures: 'xp_furniture:decorated_black_wallpaper',
    sound: 'wood',
  },
  'xp_furniture:decorated_blue_wallpaper': {
    textures: 'xp_furniture:decorated_blue_wallpaper',
    sound: 'wood',
  },
  'xp_furniture:decorated_brown_wallpaper': {
    textures: 'xp_furniture:decorated_brown_wallpaper',
    sound: 'wood',
  },
  'xp_furniture:decorated_cyan_wallpaper': {
    textures: 'xp_furniture:decorated_cyan_wallpaper',
    sound: 'wood',
  },
  'xp_furniture:decorated_gray_wallpaper': {
    textures: 'xp_furniture:decorated_gray_wallpaper',
    sound: 'wood',
  },
  'xp_furniture:decorated_green_wallpaper': {
    textures: 'xp_furniture:decorated_green_wallpaper',
    sound: 'wood',
  },
  'xp_furniture:decorated_light_blue_wallpaper': {
    textures: 'xp_furniture:decorated_light_blue_wallpaper',
    sound: 'wood',
  },
  'xp_furniture:decorated_light_gray_wallpaper': {
    textures: 'xp_furniture:decorated_light_gray_wallpaper',
    sound: 'wood',
  },
  'xp_furniture:decorated_lime_wallpaper': {
    textures: 'xp_furniture:decorated_lime_wallpaper',
    sound: 'wood',
  },
  'xp_furniture:decorated_magenta_wallpaper': {
    textures: 'xp_furniture:decorated_magenta_wallpaper',
    sound: 'wood',
  },
  'xp_furniture:decorated_orange_wallpaper': {
    textures: 'xp_furniture:decorated_orange_wallpaper',
    sound: 'wood',
  },
  'xp_furniture:decorated_pink_wallpaper': {
    textures: 'xp_furniture:decorated_pink_wallpaper',
    sound: 'wood',
  },
  'xp_furniture:decorated_purple_wallpaper': {
    textures: 'xp_furniture:decorated_purple_wallpaper',
    sound: 'wood',
  },
  'xp_furniture:decorated_red_wallpaper': {
    textures: 'xp_furniture:decorated_red_wallpaper',
    sound: 'wood',
  },
  'xp_furniture:decorated_white_wallpaper': {
    textures: 'xp_furniture:decorated_white_wallpaper',
    sound: 'wood',
  },
  'xp_furniture:decorated_yellow_wallpaper': {
    textures: 'xp_furniture:decorated_yellow_wallpaper',
    sound: 'wood',
  },
  'xp_furniture:plain_black_wallpaper': {
    textures: 'xp_furniture:plain_black_wallpaper',
    sound: 'wood',
  },
  'xp_furniture:plain_blue_wallpaper': {
    textures: 'xp_furniture:plain_blue_wallpaper',
    sound: 'wood',
  },
  'xp_furniture:plain_brown_wallpaper': {
    textures: 'xp_furniture:plain_brown_wallpaper',
    sound: 'wood',
  },
  'xp_furniture:plain_cyan_wallpaper': {
    textures: 'xp_furniture:plain_cyan_wallpaper',
    sound: 'wood',
  },
  'xp_furniture:plain_gray_wallpaper': {
    textures: 'xp_furniture:plain_gray_wallpaper',
    sound: 'wood',
  },
  'xp_furniture:plain_green_wallpaper': {
    textures: 'xp_furniture:plain_green_wallpaper',
    sound: 'wood',
  },
  'xp_furniture:plain_light_blue_wallpaper': {
    textures: 'xp_furniture:plain_light_blue_wallpaper',
    sound: 'wood',
  },
  'xp_furniture:plain_light_gray_wallpaper': {
    textures: 'xp_furniture:plain_light_gray_wallpaper',
    sound: 'wood',
  },
  'xp_furniture:plain_lime_wallpaper': {
    textures: 'xp_furniture:plain_lime_wallpaper',
    sound: 'wood',
  },
  'xp_furniture:plain_magenta_wallpaper': {
    textures: 'xp_furniture:plain_magenta_wallpaper',
    sound: 'wood',
  },
  'xp_furniture:plain_orange_wallpaper': {
    textures: 'xp_furniture:plain_orange_wallpaper',
    sound: 'wood',
  },
  'xp_furniture:plain_pink_wallpaper': {
    textures: 'xp_furniture:plain_pink_wallpaper',
    sound: 'wood',
  },
  'xp_furniture:plain_purple_wallpaper': {
    textures: 'xp_furniture:plain_purple_wallpaper',
    sound: 'wood',
  },
  'xp_furniture:plain_red_wallpaper': {
    textures: 'xp_furniture:plain_red_wallpaper',
    sound: 'wood',
  },
  'xp_furniture:plain_white_wallpaper': {
    textures: 'xp_furniture:plain_white_wallpaper',
    sound: 'wood',
  },
  'xp_furniture:plain_yellow_wallpaper': {
    textures: 'xp_furniture:plain_yellow_wallpaper',
    sound: 'wood',
  },
  'xp_furniture:black_wood_pillow': { sound: 'wood' },
  'xp_furniture:blue_wood_pillow': { sound: 'wood' },
  'xp_furniture:brown_wood_pillow': { sound: 'wood' },
  'xp_furniture:cyan_wood_pillow': { sound: 'wood' },
  'xp_furniture:gray_wood_pillow': { sound: 'wood' },
  'xp_furniture:green_wood_pillow': { sound: 'wood' },
  'xp_furniture:light_blue_wood_pillow': { sound: 'wood' },
  'xp_furniture:light_gray_wood_pillow': { sound: 'wood' },
  'xp_furniture:lime_wood_pillow': { sound: 'wood' },
  'xp_furniture:magenta_wood_pillow': { sound: 'wood' },
  'xp_furniture:orange_wood_pillow': { sound: 'wood' },
  'xp_furniture:pink_wood_pillow': { sound: 'wood' },
  'xp_furniture:purple_wood_pillow': { sound: 'wood' },
  'xp_furniture:red_wood_pillow': { sound: 'wood' },
  'xp_furniture:white_wood_pillow': { sound: 'wood' },
  'xp_furniture:yellow_wood_pillow': { sound: 'wood' },
  'xp_furniture:black_pet_bed': { sound: 'wood' },
  'xp_furniture:blue_pet_bed': { sound: 'wood' },
  'xp_furniture:brown_pet_bed': { sound: 'wood' },
  'xp_furniture:cyan_pet_bed': { sound: 'wood' },
  'xp_furniture:gray_pet_bed': { sound: 'wood' },
  'xp_furniture:green_pet_bed': { sound: 'wood' },
  'xp_furniture:light_blue_pet_bed': { sound: 'wood' },
  'xp_furniture:light_gray_pet_bed': { sound: 'wood' },
  'xp_furniture:lime_pet_bed': { sound: 'wood' },
  'xp_furniture:magenta_pet_bed': { sound: 'wood' },
  'xp_furniture:orange_pet_bed': { sound: 'wood' },
  'xp_furniture:pink_pet_bed': { sound: 'wood' },
  'xp_furniture:purple_pet_bed': { sound: 'wood' },
  'xp_furniture:red_pet_bed': { sound: 'wood' },
  'xp_furniture:white_pet_bed': { sound: 'wood' },
  'xp_furniture:yellow_pet_bed': { sound: 'wood' },
  'xp_furniture:juice_barrel': { sound: 'wood' },
  'xp_furniture:juice_barrel_v2': { sound: 'wood' },
  'xp_furniture:display_case_fancy': { sound: 'metal' },
  'xp_furniture:display_case': { sound: 'wood' },
  'xp_furniture:blue_hammock': { sound: 'cloth' },
  'xp_furniture:green_hammock': { sound: 'cloth' },
  'xp_furniture:pink_hammock': { sound: 'cloth' },
  'xp_furniture:red_hammock': { sound: 'cloth' },
  'xp_furniture:log_stack': { sound: 'wood' },
  'xp_furniture:big_pan': { sound: 'stone' },
  'xp_furniture:copper_trim_glass': { textures: 'xp_furniture:copper_trim_glass', sound: 'glass' },
  'xp_furniture:dark_trim_glass': { textures: 'xp_furniture:dark_trim_glass', sound: 'glass' },
  'xp_furniture:white_trim_glass': { textures: 'xp_furniture:white_trim_glass', sound: 'glass' },
  'xp_furniture:book_pile': { sound: 'wood' },
  'xp_furniture:broom': { sound: 'wood' },
  'xp_furniture:gnome': { sound: 'decorated_pot' },
  'xp_furniture:bricks_path': { sound: 'stone' },
  'xp_furniture:planks_path': { sound: 'wood' },
  'xp_furniture:stone_bricks_path': { sound: 'stone' },
  'xp_furniture:piano': { sound: 'wood' },
  'xp_furniture:piano_fancy': { sound: 'wood' },
  'xp_furniture:urn_1': { sound: 'decorated_pot' },
  'xp_furniture:urn_2': { sound: 'decorated_pot' },
  'xp_furniture:urn_3': { sound: 'decorated_pot' },
  'xp_furniture:urn_4': { sound: 'decorated_pot' },
  'xp_furniture:wood_mug': { sound: 'wood' },
  'xp_furniture:wood_mug_full': { sound: 'wood' },
  'xp_furniture:wood_mug_cocoa': { sound: 'wood' },
  'xp_furniture:watering_can': { sound: 'wood' },
  'xp_furniture:watering_can_empty': { sound: 'wood' },
  'xp_furniture:acacia_cabinet': { sound: 'wood' },
  'xp_furniture:bamboo_cabinet': { sound: 'bamboo_wood' },
  'xp_furniture:birch_cabinet': { sound: 'wood' },
  'xp_furniture:cherry_cabinet': { sound: 'cherry_wood' },
  'xp_furniture:crimson_cabinet': { sound: 'wood' },
  'xp_furniture:dark_oak_cabinet': { sound: 'wood' },
  'xp_furniture:jungle_cabinet': { sound: 'wood' },
  'xp_furniture:mangrove_cabinet': { sound: 'wood' },
  'xp_furniture:oak_cabinet': { sound: 'wood' },
  'xp_furniture:spruce_cabinet': { sound: 'wood' },
  'xp_furniture:warped_cabinet': { sound: 'wood' },
  'xp_furniture:pale_oak_cabinet': { sound: 'wood' },
  'xp_furniture:acacia_counter': { sound: 'wood' },
  'xp_furniture:bamboo_counter': { sound: 'bamboo_wood' },
  'xp_furniture:birch_counter': { sound: 'wood' },
  'xp_furniture:cherry_counter': { sound: 'cherry_wood' },
  'xp_furniture:crimson_counter': { sound: 'wood' },
  'xp_furniture:dark_oak_counter': { sound: 'wood' },
  'xp_furniture:jungle_counter': { sound: 'wood' },
  'xp_furniture:mangrove_counter': { sound: 'wood' },
  'xp_furniture:oak_counter': { sound: 'wood' },
  'xp_furniture:spruce_counter': { sound: 'wood' },
  'xp_furniture:warped_counter': { sound: 'wood' },
  'xp_furniture:pale_oak_counter': { sound: 'wood' },
  'xp_furniture:acacia_cupboard': { sound: 'wood' },
  'xp_furniture:bamboo_cupboard': { sound: 'bamboo_wood' },
  'xp_furniture:birch_cupboard': { sound: 'wood' },
  'xp_furniture:cherry_cupboard': { sound: 'cherry_wood' },
  'xp_furniture:crimson_cupboard': { sound: 'wood' },
  'xp_furniture:dark_oak_cupboard': { sound: 'wood' },
  'xp_furniture:jungle_cupboard': { sound: 'wood' },
  'xp_furniture:mangrove_cupboard': { sound: 'wood' },
  'xp_furniture:oak_cupboard': { sound: 'wood' },
  'xp_furniture:spruce_cupboard': { sound: 'wood' },
  'xp_furniture:warped_cupboard': { sound: 'wood' },
  'xp_furniture:pale_oak_cupboard': { sound: 'wood' },
  'xp_furniture:grow_lamp': { sound: 'copper' },
  'xp_furniture:grow_lamp_v2': { sound: 'copper' },
  'xp_furniture:acacia_sideboard': { sound: 'wood' },
  'xp_furniture:bamboo_sideboard': { sound: 'bamboo_wood' },
  'xp_furniture:birch_sideboard': { sound: 'wood' },
  'xp_furniture:cherry_sideboard': { sound: 'cherry_wood' },
  'xp_furniture:crimson_sideboard': { sound: 'wood' },
  'xp_furniture:dark_oak_sideboard': { sound: 'wood' },
  'xp_furniture:jungle_sideboard': { sound: 'wood' },
  'xp_furniture:mangrove_sideboard': { sound: 'wood' },
  'xp_furniture:oak_sideboard': { sound: 'wood' },
  'xp_furniture:spruce_sideboard': { sound: 'wood' },
  'xp_furniture:warped_sideboard': { sound: 'wood' },
  'xp_furniture:pale_oak_sideboard': { sound: 'wood' },
  'xp_furniture:oak_lamp': { sound: 'wood' },
  'xp_furniture:spruce_lamp': { sound: 'wood' },
  'xp_furniture:birch_lamp': { sound: 'wood' },
  'xp_furniture:jungle_lamp': { sound: 'wood' },
  'xp_furniture:acacia_lamp': { sound: 'wood' },
  'xp_furniture:dark_oak_lamp': { sound: 'wood' },
  'xp_furniture:mangrove_lamp': { sound: 'wood' },
  'xp_furniture:cherry_lamp': { sound: 'wood' },
  'xp_furniture:pale_oak_lamp': { sound: 'wood' },
  'xp_furniture:bamboo_lamp': { sound: 'wood' },
  'xp_furniture:crimson_lamp': { sound: 'wood' },
  'xp_furniture:warped_lamp': { sound: 'wood' },
  'xp_furniture:oak_lamp_v2': { sound: 'wood' },
  'xp_furniture:spruce_lamp_v2': { sound: 'wood' },
  'xp_furniture:birch_lamp_v2': { sound: 'wood' },
  'xp_furniture:jungle_lamp_v2': { sound: 'wood' },
  'xp_furniture:acacia_lamp_v2': { sound: 'wood' },
  'xp_furniture:dark_oak_lamp_v2': { sound: 'wood' },
  'xp_furniture:mangrove_lamp_v2': { sound: 'wood' },
  'xp_furniture:cherry_lamp_v2': { sound: 'wood' },
  'xp_furniture:pale_oak_lamp_v2': { sound: 'wood' },
  'xp_furniture:bamboo_lamp_v2': { sound: 'wood' },
  'xp_furniture:crimson_lamp_v2': { sound: 'wood' },
  'xp_furniture:warped_lamp_v2': { sound: 'wood' },
  'xp_furniture:oak_standing_lamp': { sound: 'wood' },
  'xp_furniture:spruce_standing_lamp': { sound: 'wood' },
  'xp_furniture:birch_standing_lamp': { sound: 'wood' },
  'xp_furniture:jungle_standing_lamp': { sound: 'wood' },
  'xp_furniture:acacia_standing_lamp': { sound: 'wood' },
  'xp_furniture:dark_oak_standing_lamp': { sound: 'wood' },
  'xp_furniture:mangrove_standing_lamp': { sound: 'wood' },
  'xp_furniture:cherry_standing_lamp': { sound: 'wood' },
  'xp_furniture:pale_oak_standing_lamp': { sound: 'wood' },
  'xp_furniture:bamboo_standing_lamp': { sound: 'wood' },
  'xp_furniture:crimson_standing_lamp': { sound: 'wood' },
  'xp_furniture:warped_standing_lamp': { sound: 'wood' },
  'xp_furniture:oak_standing_lamp_v2': { sound: 'wood' },
  'xp_furniture:spruce_standing_lamp_v2': { sound: 'wood' },
  'xp_furniture:birch_standing_lamp_v2': { sound: 'wood' },
  'xp_furniture:jungle_standing_lamp_v2': { sound: 'wood' },
  'xp_furniture:acacia_standing_lamp_v2': { sound: 'wood' },
  'xp_furniture:dark_oak_standing_lamp_v2': { sound: 'wood' },
  'xp_furniture:mangrove_standing_lamp_v2': { sound: 'wood' },
  'xp_furniture:cherry_standing_lamp_v2': { sound: 'wood' },
  'xp_furniture:pale_oak_standing_lamp_v2': { sound: 'wood' },
  'xp_furniture:bamboo_standing_lamp_v2': { sound: 'wood' },
  'xp_furniture:crimson_standing_lamp_v2': { sound: 'wood' },
  'xp_furniture:warped_standing_lamp_v2': { sound: 'wood' },
  'xp_furniture:oak_table_lamp': { sound: 'wood' },
  'xp_furniture:spruce_table_lamp': { sound: 'wood' },
  'xp_furniture:birch_table_lamp': { sound: 'wood' },
  'xp_furniture:jungle_table_lamp': { sound: 'wood' },
  'xp_furniture:acacia_table_lamp': { sound: 'wood' },
  'xp_furniture:dark_oak_table_lamp': { sound: 'wood' },
  'xp_furniture:mangrove_table_lamp': { sound: 'wood' },
  'xp_furniture:cherry_table_lamp': { sound: 'wood' },
  'xp_furniture:pale_oak_table_lamp': { sound: 'wood' },
  'xp_furniture:bamboo_table_lamp': { sound: 'wood' },
  'xp_furniture:crimson_table_lamp': { sound: 'wood' },
  'xp_furniture:warped_table_lamp': { sound: 'wood' },
  'xp_furniture:iron_beam': { sound: 'metal' },
  'xp_furniture:big_gold_candle_holder': { sound: 'metal' },
  'xp_furniture:big_metal_candle_holder': { sound: 'metal' },
  'xp_furniture:small_iron_candle_holder': { sound: 'metal' },
  'xp_furniture:small_metal_candle_holder': { sound: 'metal' },
  'xp_furniture:big_gold_candle_holder_v2': { sound: 'metal' },
  'xp_furniture:big_metal_candle_holder_v2': { sound: 'metal' },
  'xp_furniture:small_iron_candle_holder_v2': { sound: 'metal' },
  'xp_furniture:small_metal_candle_holder_v2': { sound: 'metal' },
  'xp_furniture:chandelier': { sound: 'chain' },
  'xp_furniture:chandelier_golden': { sound: 'chain' },
  'xp_furniture:chandelier_v2': { sound: 'chain' },
  'xp_furniture:chandelier_golden_v2': { sound: 'chain' },
  'xp_furniture:white_curtain': { sound: 'cloth' },
  'xp_furniture:light_gray_curtain': { sound: 'cloth' },
  'xp_furniture:gray_curtain': { sound: 'cloth' },
  'xp_furniture:black_curtain': { sound: 'cloth' },
  'xp_furniture:brown_curtain': { sound: 'cloth' },
  'xp_furniture:red_curtain': { sound: 'cloth' },
  'xp_furniture:orange_curtain': { sound: 'cloth' },
  'xp_furniture:yellow_curtain': { sound: 'cloth' },
  'xp_furniture:lime_curtain': { sound: 'cloth' },
  'xp_furniture:green_curtain': { sound: 'cloth' },
  'xp_furniture:cyan_curtain': { sound: 'cloth' },
  'xp_furniture:light_blue_curtain': { sound: 'cloth' },
  'xp_furniture:blue_curtain': { sound: 'cloth' },
  'xp_furniture:purple_curtain': { sound: 'cloth' },
  'xp_furniture:magenta_curtain': { sound: 'cloth' },
  'xp_furniture:pink_curtain': { sound: 'cloth' },
  'xp_furniture:white_curtain_v2': { sound: 'cloth' },
  'xp_furniture:light_gray_curtain_v2': { sound: 'cloth' },
  'xp_furniture:gray_curtain_v2': { sound: 'cloth' },
  'xp_furniture:black_curtain_v2': { sound: 'cloth' },
  'xp_furniture:brown_curtain_v2': { sound: 'cloth' },
  'xp_furniture:red_curtain_v2': { sound: 'cloth' },
  'xp_furniture:orange_curtain_v2': { sound: 'cloth' },
  'xp_furniture:yellow_curtain_v2': { sound: 'cloth' },
  'xp_furniture:lime_curtain_v2': { sound: 'cloth' },
  'xp_furniture:green_curtain_v2': { sound: 'cloth' },
  'xp_furniture:cyan_curtain_v2': { sound: 'cloth' },
  'xp_furniture:light_blue_curtain_v2': { sound: 'cloth' },
  'xp_furniture:blue_curtain_v2': { sound: 'cloth' },
  'xp_furniture:purple_curtain_v2': { sound: 'cloth' },
  'xp_furniture:magenta_curtain_v2': { sound: 'cloth' },
  'xp_furniture:pink_curtain_v2': { sound: 'cloth' },
  'xp_furniture:white_double_curtain': { sound: 'cloth' },
  'xp_furniture:light_gray_double_curtain': { sound: 'cloth' },
  'xp_furniture:gray_double_curtain': { sound: 'cloth' },
  'xp_furniture:black_double_curtain': { sound: 'cloth' },
  'xp_furniture:brown_double_curtain': { sound: 'cloth' },
  'xp_furniture:red_double_curtain': { sound: 'cloth' },
  'xp_furniture:orange_double_curtain': { sound: 'cloth' },
  'xp_furniture:yellow_double_curtain': { sound: 'cloth' },
  'xp_furniture:lime_double_curtain': { sound: 'cloth' },
  'xp_furniture:green_double_curtain': { sound: 'cloth' },
  'xp_furniture:cyan_double_curtain': { sound: 'cloth' },
  'xp_furniture:light_blue_double_curtain': { sound: 'cloth' },
  'xp_furniture:blue_double_curtain': { sound: 'cloth' },
  'xp_furniture:purple_double_curtain': { sound: 'cloth' },
  'xp_furniture:magenta_double_curtain': { sound: 'cloth' },
  'xp_furniture:pink_double_curtain': { sound: 'cloth' },
  'xp_furniture:white_double_curtain_v2': { sound: 'cloth' },
  'xp_furniture:light_gray_double_curtain_v2': { sound: 'cloth' },
  'xp_furniture:gray_double_curtain_v2': { sound: 'cloth' },
  'xp_furniture:black_double_curtain_v2': { sound: 'cloth' },
  'xp_furniture:brown_double_curtain_v2': { sound: 'cloth' },
  'xp_furniture:red_double_curtain_v2': { sound: 'cloth' },
  'xp_furniture:orange_double_curtain_v2': { sound: 'cloth' },
  'xp_furniture:yellow_double_curtain_v2': { sound: 'cloth' },
  'xp_furniture:lime_double_curtain_v2': { sound: 'cloth' },
  'xp_furniture:green_double_curtain_v2': { sound: 'cloth' },
  'xp_furniture:cyan_double_curtain_v2': { sound: 'cloth' },
  'xp_furniture:light_blue_double_curtain_v2': { sound: 'cloth' },
  'xp_furniture:blue_double_curtain_v2': { sound: 'cloth' },
  'xp_furniture:purple_double_curtain_v2': { sound: 'cloth' },
  'xp_furniture:magenta_double_curtain_v2': { sound: 'cloth' },
  'xp_furniture:pink_double_curtain_v2': { sound: 'cloth' },
  'xp_furniture:globe': { sound: 'wood' },
  'xp_furniture:globe_colored': { sound: 'wood' },
  'xp_furniture:grandfather_clock': { sound: 'wood' },
  'xp_furniture:fancy_grandfather_clock': { sound: 'wood' },
  'xp_furniture:small_grandfather_clock': { sound: 'wood' },
  'xp_furniture:small_fancy_grandfather_clock': { sound: 'wood' },
  'xp_furniture:haystack': { sound: 'grass' },
  'xp_furniture:haystack_pitchfork': { sound: 'grass' },
  'xp_furniture:bongos': { sound: 'wood' },
  'xp_furniture:harp': { sound: 'wood' },
  'xp_furniture:metal_pump': { sound: 'stone' },
  'xp_furniture:cow_plushie': { sound: 'cloth' },
  'xp_furniture:creeper_plushie': { sound: 'cloth' },
  'xp_furniture:enderman_plushie': { sound: 'cloth' },
  'xp_furniture:pig_plushie': { sound: 'cloth' },
  'xp_furniture:sheep_plushie': { sound: 'cloth' },
  'xp_furniture:zombie_plushie': { sound: 'cloth' },
  'xp_furniture:axolotl_plushie': { sound: 'cloth' },
  'xp_furniture:bee_plushie': { sound: 'cloth' },
  'xp_furniture:dragon_plushie': { sound: 'cloth' },
  'xp_furniture:fox_plushie': { sound: 'cloth' },
  'xp_furniture:mooshroom_plushie': { sound: 'cloth' },
  'xp_furniture:wolf_plushie': { sound: 'cloth' },
  'xp_furniture:armadillo_plushie': { sound: 'cloth' },
  'xp_furniture:cat_plushie': { sound: 'cloth' },
  'xp_furniture:bat_plushie': { sound: 'cloth' },
  'xp_furniture:skeleton_plushie': { sound: 'cloth' },
  'xp_furniture:spider_plushie': { sound: 'cloth' },
  'xp_furniture:polar_bear_plushie': { sound: 'cloth' },
  'xp_furniture:snow_golem_plushie': { sound: 'cloth' },
  'xp_furniture:snow_golem_pumpkin_plushie': { sound: 'cloth' },
  'xp_furniture:cave_dweller_plushie': { sound: 'cloth' },
  'xp_furniture:metal_small_fountain': { sound: 'stone' },
  'xp_furniture:diorite_small_fountain': { sound: 'stone' },
  'xp_furniture:small_wind_wheel': { sound: 'wood' },
  'xp_furniture:bamboo_wind_chimes': { sound: 'bamboo_wood' },
  'xp_furniture:copper_wind_chimes': { sound: 'copper' },
  'xp_furniture:iron_wind_chimes': { sound: 'amethyst_block' },
  'xp_furniture:aquarium': { sound: 'stone' },
  'xp_furniture:barred_door': { sound: 'wood' },
  'xp_furniture:acacia_chair': { sound: 'wood' },
  'xp_furniture:bamboo_chair': { sound: 'bamboo_wood' },
  'xp_furniture:birch_chair': { sound: 'wood' },
  'xp_furniture:cherry_chair': { sound: 'cherry_wood' },
  'xp_furniture:crimson_chair': { sound: 'wood' },
  'xp_furniture:dark_oak_chair': { sound: 'wood' },
  'xp_furniture:jungle_chair': { sound: 'wood' },
  'xp_furniture:mangrove_chair': { sound: 'wood' },
  'xp_furniture:oak_chair': { sound: 'wood' },
  'xp_furniture:spruce_chair': { sound: 'wood' },
  'xp_furniture:warped_chair': { sound: 'wood' },
  'xp_furniture:pale_oak_chair': { sound: 'wood' },
  'xp_furniture:oak_big_chest': { sound: 'wood' },
  'xp_furniture:standing_camera': { sound: 'wood' },
  'xp_furniture:chicken_nest': { sound: 'grass' },
  'xp_furniture:glass_jar': { sound: 'glass' },
  'xp_furniture:oak_hanging_item_sign': { sound: 'hanging_sign' },
  'xp_furniture:spruce_hanging_item_sign': { sound: 'hanging_sign' },
  'xp_furniture:birch_hanging_item_sign': { sound: 'hanging_sign' },
  'xp_furniture:jungle_hanging_item_sign': { sound: 'hanging_sign' },
  'xp_furniture:acacia_hanging_item_sign': { sound: 'hanging_sign' },
  'xp_furniture:dark_oak_hanging_item_sign': { sound: 'hanging_sign' },
  'xp_furniture:mangrove_hanging_item_sign': { sound: 'hanging_sign' },
  'xp_furniture:cherry_hanging_item_sign': { sound: 'hanging_sign' },
  'xp_furniture:pale_oak_hanging_item_sign': { sound: 'hanging_sign' },
  'xp_furniture:bamboo_hanging_item_sign': { sound: 'hanging_sign' },
  'xp_furniture:crimson_hanging_item_sign': { sound: 'hanging_sign' },
  'xp_furniture:warped_hanging_item_sign': { sound: 'hanging_sign' },
  'xp_furniture:oak_hanging_item_sign_v2': { sound: 'hanging_sign' },
  'xp_furniture:spruce_hanging_item_sign_v2': { sound: 'hanging_sign' },
  'xp_furniture:birch_hanging_item_sign_v2': { sound: 'hanging_sign' },
  'xp_furniture:jungle_hanging_item_sign_v2': { sound: 'hanging_sign' },
  'xp_furniture:acacia_hanging_item_sign_v2': { sound: 'hanging_sign' },
  'xp_furniture:dark_oak_hanging_item_sign_v2': { sound: 'hanging_sign' },
  'xp_furniture:mangrove_hanging_item_sign_v2': { sound: 'hanging_sign' },
  'xp_furniture:cherry_hanging_item_sign_v2': { sound: 'hanging_sign' },
  'xp_furniture:pale_oak_hanging_item_sign_v2': { sound: 'hanging_sign' },
  'xp_furniture:bamboo_hanging_item_sign_v2': { sound: 'hanging_sign' },
  'xp_furniture:crimson_hanging_item_sign_v2': { sound: 'hanging_sign' },
  'xp_furniture:warped_hanging_item_sign_v2': { sound: 'hanging_sign' },
  'xp_furniture:acacia_shelf': { sound: 'wood' },
  'xp_furniture:bamboo_shelf': { sound: 'bamboo_wood' },
  'xp_furniture:birch_shelf': { sound: 'wood' },
  'xp_furniture:cherry_shelf': { sound: 'cherry_wood' },
  'xp_furniture:crimson_shelf': { sound: 'wood' },
  'xp_furniture:dark_oak_shelf': { sound: 'wood' },
  'xp_furniture:jungle_shelf': { sound: 'wood' },
  'xp_furniture:mangrove_shelf': { sound: 'wood' },
  'xp_furniture:oak_shelf': { sound: 'wood' },
  'xp_furniture:spruce_shelf': { sound: 'wood' },
  'xp_furniture:warped_shelf': { sound: 'wood' },
  'xp_furniture:pale_oak_shelf': { sound: 'wood' },
  'xp_furniture:acacia_rocking_chair': { sound: 'wood' },
  'xp_furniture:bamboo_rocking_chair': { sound: 'bamboo_wood' },
  'xp_furniture:birch_rocking_chair': { sound: 'wood' },
  'xp_furniture:cherry_rocking_chair': { sound: 'cherry_wood' },
  'xp_furniture:crimson_rocking_chair': { sound: 'wood' },
  'xp_furniture:dark_oak_rocking_chair': { sound: 'wood' },
  'xp_furniture:jungle_rocking_chair': { sound: 'wood' },
  'xp_furniture:mangrove_rocking_chair': { sound: 'wood' },
  'xp_furniture:oak_rocking_chair': { sound: 'wood' },
  'xp_furniture:spruce_rocking_chair': { sound: 'wood' },
  'xp_furniture:warped_rocking_chair': { sound: 'wood' },
  'xp_furniture:pale_oak_rocking_chair': { sound: 'wood' },
  'xp_furniture:acacia_rocking_chair_v2': { sound: 'wood' },
  'xp_furniture:bamboo_rocking_chair_v2': { sound: 'bamboo_wood' },
  'xp_furniture:birch_rocking_chair_v2': { sound: 'wood' },
  'xp_furniture:cherry_rocking_chair_v2': { sound: 'cherry_wood' },
  'xp_furniture:crimson_rocking_chair_v2': { sound: 'wood' },
  'xp_furniture:dark_oak_rocking_chair_v2': { sound: 'wood' },
  'xp_furniture:jungle_rocking_chair_v2': { sound: 'wood' },
  'xp_furniture:mangrove_rocking_chair_v2': { sound: 'wood' },
  'xp_furniture:oak_rocking_chair_v2': { sound: 'wood' },
  'xp_furniture:spruce_rocking_chair_v2': { sound: 'wood' },
  'xp_furniture:warped_rocking_chair_v2': { sound: 'wood' },
  'xp_furniture:pale_oak_rocking_chair_v2': { sound: 'wood' },
  'xp_furniture:scarecrow': { sound: 'grass' },
  'xp_furniture:oak_slab_chest': { sound: 'wood' },
  'xp_furniture:sprinkler': { sound: 'stone' },
  'xp_furniture:blackstone_stove': { sound: 'stone' },
  'xp_furniture:copper_stove': { sound: 'copper' },
  'xp_furniture:iron_stove': { sound: 'stone' },
  'xp_furniture:stone_stove': { sound: 'stone' },
  'xp_furniture:blackstone_stove_v2': { sound: 'stone' },
  'xp_furniture:copper_stove_v2': { sound: 'copper' },
  'xp_furniture:iron_stove_v2': { sound: 'stone' },
  'xp_furniture:stone_stove_v2': { sound: 'stone' },
  'xp_furniture:acacia_stool': { sound: 'wood' },
  'xp_furniture:bamboo_stool': { sound: 'bamboo_wood' },
  'xp_furniture:birch_stool': { sound: 'wood' },
  'xp_furniture:cherry_stool': { sound: 'cherry_wood' },
  'xp_furniture:crimson_stool': { sound: 'wood' },
  'xp_furniture:dark_oak_stool': { sound: 'wood' },
  'xp_furniture:jungle_stool': { sound: 'wood' },
  'xp_furniture:mangrove_stool': { sound: 'wood' },
  'xp_furniture:oak_stool': { sound: 'wood' },
  'xp_furniture:spruce_stool': { sound: 'wood' },
  'xp_furniture:warped_stool': { sound: 'wood' },
  'xp_furniture:pale_oak_stool': { sound: 'wood' },
  'xp_furniture:telescope': { sound: 'stone' },
  'xp_furniture:tool_rack': { sound: 'wood' },
  'xp_furniture:water_mill': { sound: 'wood' },
  'xp_furniture:wind_mill': { sound: 'wood' },
  'xp_furniture:placeable_salad': { sound: 'wood' },
  'xp_furniture:apple': { sound: 'wood' },
  'xp_furniture:baked_potato': { sound: 'azalea' },
  'xp_furniture:beetroot_soup': { sound: 'wood' },
  'xp_furniture:bow_with_arrow': { sound: 'wood' },
  'xp_furniture:bow': { sound: 'wood' },
  'xp_furniture:bunch_of_carrots': { sound: 'azalea' },
  'xp_furniture:clock': { sound: 'stone' },
  'xp_furniture:compass': { sound: 'stone' },
  'xp_furniture:cooked_beef': { sound: 'wood' },
  'xp_furniture:cooked_chicken': { sound: 'wood' },
  'xp_furniture:cooked_rabbit': { sound: 'wood' },
  'xp_furniture:cookie': { sound: 'azalea' },
  'xp_furniture:crossbow': { sound: 'wood' },
  'xp_furniture:emerald': { sound: 'stone' },
  'xp_furniture:ender_eye': { sound: 'lodestone' },
  'xp_furniture:ender_pearl': { sound: 'stone' },
  'xp_furniture:fishing_rod': { sound: 'wood' },
  'xp_furniture:golden_apple': { sound: 'metal' },
  'xp_furniture:mushroom_stew': { sound: 'wood' },
  'xp_furniture:pufferfish': { sound: 'honey_block' },
  'xp_furniture:pumpkin_pie': { sound: 'cloth' },
  'xp_furniture:quiver': { sound: 'cloth' },
  'xp_furniture:rabbit_stew': { sound: 'wood' },
  'xp_furniture:salmon': { sound: 'honey_block' },
  'xp_furniture:totem_of_undying': { sound: 'metal' },
  'xp_furniture:uncooked_beef': { sound: 'honey_block' },
  'xp_furniture:uncooked_chicken': { sound: 'honey_block' },
  'xp_furniture:uncooked_rabbit': { sound: 'honey_block' },
  'xp_furniture:placeable_bread': { sound: 'azalea' },
  'xp_furniture:placeable_raw_porkchop': { sound: 'honey_block' },
  'xp_furniture:placeable_cooked_porkchop': { sound: 'wood' },
  'xp_furniture:placeable_raw_mutton': { sound: 'honey_block' },
  'xp_furniture:placeable_cooked_mutton': { sound: 'wood' },
  'xp_furniture:placeable_cooked_salmon': { sound: 'wood' },
  'xp_furniture:placeable_raw_cod': { sound: 'honey_block' },
  'xp_furniture:placeable_cooked_cod': { sound: 'wood' },
  'xp_furniture:placeable_poisonous_potato': { sound: 'azalea' },
  'xp_furniture:placeable_beetroot': { sound: 'azalea' },
  'xp_furniture:placeable_bunch_of_golden_carrots': { sound: 'azalea' },
  'xp_furniture:placeable_enchanted_golden_apple': { sound: 'metal' },
  'xp_furniture:placeable_melon': { sound: 'azalea' },
  'xp_furniture:placeable_sweet_berries': { sound: 'azalea' },
  'xp_furniture:placeable_glow_berries': { sound: 'vines' },
  'xp_furniture:placeable_dried_kelp': { sound: 'moss_block' },
  'xp_furniture:placeable_bell_pepper': { sound: 'azalea' },
  'xp_furniture:placeable_chilipepper': { sound: 'azalea' },
  'xp_furniture:placeable_cabbage': { sound: 'grass' },
  'xp_furniture:placeable_corn': { sound: 'grass' },
  'xp_furniture:placeable_grilled_corn': { sound: 'wood' },
  'xp_furniture:placeable_eggplant': { sound: 'grass' },
  'xp_furniture:placeable_grilled_eggplant': { sound: 'wood' },
  'xp_furniture:placeable_tomato': { sound: 'honey_block' },
  'xp_furniture:overgrown_grass_default': { sound: 'grass' },
  'xp_furniture:overgrown_grass_badlands': { sound: 'grass' },
  'xp_furniture:overgrown_grass_birch': { sound: 'grass' },
  'xp_furniture:overgrown_grass_darkforest': { sound: 'grass' },
  'xp_furniture:overgrown_grass_forest': { sound: 'grass' },
  'xp_furniture:overgrown_grass_frozenriver': { sound: 'grass' },
  'xp_furniture:overgrown_grass_jungle': { sound: 'grass' },
  'xp_furniture:overgrown_grass_mushroom': { sound: 'grass' },
  'xp_furniture:overgrown_grass_ocean': { sound: 'grass' },
  'xp_furniture:overgrown_grass_plains': { sound: 'grass' },
  'xp_furniture:overgrown_grass_savanna': { sound: 'grass' },
  'xp_furniture:overgrown_grass_swamp': { sound: 'grass' },
  'xp_furniture:overgrown_grass_swamp2': { sound: 'grass' },
  'xp_furniture:overgrown_grass_taiga': { sound: 'grass' },
  'xp_furniture:blazing_star': { sound: 'grass' },
  'xp_furniture:butterflower_cluster': { sound: 'grass' },
  'xp_furniture:butterfly_milkweed': { sound: 'grass' },
  'xp_furniture:clover_cluster': { sound: 'nether_sprouts' },
  'xp_furniture:flower_cluster_0': { sound: 'grass' },
  'xp_furniture:flower_cluster_1': { sound: 'grass' },
  'xp_furniture:flower_cluster_2': { sound: 'grass' },
  'xp_furniture:flower_cluster_3': { sound: 'grass' },
  'xp_furniture:foxglove': { sound: 'grass' },
  'xp_furniture:ivy': { sound: 'hanging_roots' },
  'xp_furniture:ivy_purple': { sound: 'hanging_roots' },
  'xp_furniture:ivy_white': { sound: 'hanging_roots' },
  'xp_furniture:mossy_pebbles': { sound: 'stone' },
  'xp_furniture:muck': { sound: 'mud', textures: 'xp_furniture:muck' },
  'xp_furniture:mushroom_cluster': { sound: 'fungus' },
  'xp_furniture:pebbles': { sound: 'stone' },
  'xp_furniture:pot_1': { sound: 'decorated_pot' },
  'xp_furniture:pot_2': { sound: 'decorated_pot' },
  'xp_furniture:pot_3': { sound: 'decorated_pot' },
  'xp_furniture:frog_statue': { sound: 'tuff' },
  'xp_furniture:skeleton_statue': { sound: 'tuff' },
  'xp_furniture:wolf_statue': { sound: 'tuff' },
  'xp_furniture:shelf_fungus': { sound: 'hanging_roots' },
  'xp_furniture:small_cluster_lily_pad': { sound: 'grass' },
  'xp_furniture:clover_weeds': { sound: 'nether_sprouts' },
  'xp_furniture:cluster_weeds': { sound: 'nether_sprouts' },
  'xp_furniture:small_weeds_cluster': { sound: 'azalea' },
  'xp_furniture:spike_weeds': { sound: 'nether_sprouts' },
  'xp_furniture:tall_weeds': { sound: 'nether_sprouts' },
  'xp_furniture:wet_dirt': { sound: 'mud', textures: 'xp_furniture:wet_dirt' },
  'xp_furniture:dogwood_sapling': { sound: 'grass' },
  'xp_furniture:yellow_birch_sapling': { sound: 'grass' },
  'xp_furniture:orange_acacia_sapling': { sound: 'grass' },
  'xp_furniture:golden_chain_sapling': { sound: 'grass' },
  'xp_furniture:wisteria_sapling': { sound: 'grass' },
  'xp_furniture:willow_sapling': { sound: 'grass' },
  'xp_furniture:rope': { sound: 'azalea' },
  'xp_furniture:black_rope_flag': { sound: 'azalea' },
  'xp_furniture:blue_rope_flag': { sound: 'azalea' },
  'xp_furniture:brown_rope_flag': { sound: 'azalea' },
  'xp_furniture:cyan_rope_flag': { sound: 'azalea' },
  'xp_furniture:gray_rope_flag': { sound: 'azalea' },
  'xp_furniture:green_rope_flag': { sound: 'azalea' },
  'xp_furniture:light_blue_rope_flag': { sound: 'azalea' },
  'xp_furniture:light_gray_rope_flag': { sound: 'azalea' },
  'xp_furniture:lime_rope_flag': { sound: 'azalea' },
  'xp_furniture:magenta_rope_flag': { sound: 'azalea' },
  'xp_furniture:orange_rope_flag': { sound: 'azalea' },
  'xp_furniture:pink_rope_flag': { sound: 'azalea' },
  'xp_furniture:purple_rope_flag': { sound: 'azalea' },
  'xp_furniture:red_rope_flag': { sound: 'azalea' },
  'xp_furniture:white_rope_flag': { sound: 'azalea' },
  'xp_furniture:yellow_rope_flag': { sound: 'azalea' },
  'xp_furniture:rope_mistletoe.hanging': { sound: 'azalea' },
  'xp_furniture:rope_sock_0': { sound: 'azalea' },
  'xp_furniture:rope_sock_1': { sound: 'azalea' },
  'xp_furniture:rope_sock_2': { sound: 'azalea' },
  'xp_furniture:rope_sock_3': { sound: 'azalea' },
  'xp_furniture:rope_sock_4': { sound: 'azalea' },
  'xp_furniture:big_flower_pot_hanging_dark_green': { sound: 'stone' },
  'xp_furniture:big_flower_pot_hanging_decorated': { sound: 'stone' },
  'xp_furniture:big_flower_pot_hanging_dotted': { sound: 'stone' },
  'xp_furniture:big_flower_pot_hanging_lined': { sound: 'stone' },
  'xp_furniture:big_flower_pot_hanging_plain': { sound: 'stone' },
  'xp_furniture:big_flower_pot_hanging_weaved': { sound: 'stone' },
  'xp_furniture:big_flower_pot_hanging_wooden': { sound: 'stone' },
  'xp_furniture:big_flower_pot_normal_dark_green': { sound: 'stone' },
  'xp_furniture:big_flower_pot_normal_decorated': { sound: 'stone' },
  'xp_furniture:big_flower_pot_normal_dotted': { sound: 'stone' },
  'xp_furniture:big_flower_pot_normal_lined': { sound: 'stone' },
  'xp_furniture:big_flower_pot_normal_plain': { sound: 'stone' },
  'xp_furniture:big_flower_pot_normal_weaved': { sound: 'stone' },
  'xp_furniture:big_flower_pot_normal_wooden': { sound: 'stone' },
  'xp_furniture:acacia_windowframe': { sound: 'wood' },
  'xp_furniture:bamboo_windowframe': { sound: 'bamboo_wood' },
  'xp_furniture:birch_windowframe': { sound: 'wood' },
  'xp_furniture:cherry_windowframe': { sound: 'cherry_wood' },
  'xp_furniture:crimson_windowframe': { sound: 'wood' },
  'xp_furniture:dark_oak_windowframe': { sound: 'wood' },
  'xp_furniture:jungle_windowframe': { sound: 'wood' },
  'xp_furniture:mangrove_windowframe': { sound: 'wood' },
  'xp_furniture:oak_windowframe': { sound: 'wood' },
  'xp_furniture:spruce_windowframe': { sound: 'wood' },
  'xp_furniture:warped_windowframe': { sound: 'wood' },
  'xp_furniture:pale_oak_windowframe': { sound: 'wood' },
  'xp_furniture:paper_divider': { sound: 'scaffolding' },
  'xp_furniture:woven_divider': { sound: 'scaffolding' },
  'xp_furniture:paper_divider_v2': { sound: 'scaffolding' },
  'xp_furniture:woven_divider_v2': { sound: 'scaffolding' },
  'xp_furniture:blinds_v2': { sound: 'wood' },
  'xp_furniture:double_blinds_v2': { sound: 'wood' },
  'xp_furniture:icicle': { sound: 'glass' },
  'xp_furniture:ukulele': { sound: 'wood' },
  'xp_furniture:panflute': { sound: 'wood' },
  'xp_furniture:settings': { sound: 'wood' },
  'xp_furniture:furnishing_table': {
    sound: 'wood',
    textures: {
      down: 'xp_furniture:furnishing_down',
      east: 'xp_furniture:furnishing_east',
      north: 'xp_furniture:furnishing_north',
      south: 'xp_furniture:furnishing_south',
      up: 'xp_furniture:furnishing_up',
      west: 'xp_furniture:furnishing_west',
    },
  },
};
var Mr = class Mr {
  static destroyBlock(r, t = !0) {
    r != null &&
      (r.setType('minecraft:air'),
      t && Mr.logger.info(`Destroyed block at ${JSON.stringify(r.location)}`));
  }
  static destroyMultiBlock(r, t, n, o = (i) => {}) {
    let i = f.from(r.location).add({ x: t[0] - 1, y: t[1] - 1, z: t[2] - 1 }),
      a = r.dimension;
    (new Ir(a, r.location, i).fetchBlocks().forEach((u) => {
      u && (n == null || !n.includes(u.typeId)) && (o(u), this.destroyBlock(u, !1));
    }),
      Mr.logger.info(`Destroyed blocks around ${JSON.stringify(r.location)}`));
  }
  static getBlockInFace(r, t, n = 1) {
    let o,
      i = {
        [Tr.Down]: 'below',
        [Tr.Up]: 'above',
        [Tr.North]: 'north',
        [Tr.South]: 'south',
        [Tr.West]: 'west',
        [Tr.East]: 'east',
      },
      u = typeof t == 'string' ? ({ Down: 'below', Up: 'above' }[t] ?? t.toLowerCase()) : i[t];
    try {
      o = r[u](n);
    } catch (_) {
      if (_ instanceof Error && _.message.includes('not a function'))
        Mr.logger.warn(
          'getBlockInFace is attempting to acquire an invalid block direction:',
          u,
          'with key',
          t,
        );
      else throw _;
    }
    return o;
  }
  static getOpposingBlockFromPlayerDirection(r, t) {
    return { 0: r?.north(), 1: r?.east(), 2: r?.south(), 3: r?.west() }[
      y.getPlayerCardinalDirection(t)
    ];
  }
  static summonAuxiliaryEntity(r, t, n = {}) {
    let { targetRotation: o, spawnEvent: i, centerBlock: a } = n,
      u = a ? [r.center().x, r.y, r.center().z] : [r.x, r.y, r.z],
      _ = n.spawnOffset
        ? [u[0] + n.spawnOffset.x, u[1] + n.spawnOffset.y, u[2] + n.spawnOffset.z]
        : u,
      s = `summon ${t} ${_.join(' ')}${o ? ('z' in o ? ` facing ${o.x} ${o.y} ${o.z}` : ` ${o.y} ${o.x}`) : ' 0 0'}${i ? ` ${i}` : ''}`;
    return (
      r.dimension.runCommand(s),
      r.dimension.getEntities({ type: t, location: { x: _[0], y: _[1], z: _[2] }, closest: 1 })[0]
    );
  }
  static isIgnoredBlock(r, t, n) {
    if (!r || r?.isAir) return !0;
    let o = t ? (typeof t == 'string' ? [nn, t].flat() : [nn, ...t].flat()) : nn;
    return (n && (o = o.filter((i) => !n.includes(i))), o.some((i) => r.typeId === i));
  }
  static isReplaceableBlock(r, t = !0) {
    if (r == null) return !0;
    let n = r.permutation;
    return (
      (t
        ? r.dimension
            .getEntitiesAtBlockLocation(r.location)
            .filter((o) => !o.matches({ type: 'minecraft:item' })).length == 0
        : !0) && ur.some((o) => n.matches(o))
    );
  }
  static requestBlockDigSound(r) {
    let t = { amethyst_block: 'break.amethyst_block', glass: 'dig.stone' },
      n = mi[r.typeId]?.sound;
    return (r.dimension.playSound(t[n] || `dig.${n}`, r.location), n);
  }
};
Mr.logger = h.getLogger('FurniturePack', 'Utilities', 'Block');
var q = Mr;
var Dt = [
  'xp_furniture:acacia_shelf',
  'xp_furniture:bamboo_shelf',
  'xp_furniture:birch_shelf',
  'xp_furniture:cherry_shelf',
  'xp_furniture:crimson_shelf',
  'xp_furniture:dark_oak_shelf',
  'xp_furniture:jungle_shelf',
  'xp_furniture:mangrove_shelf',
  'xp_furniture:oak_shelf',
  'xp_furniture:spruce_shelf',
  'xp_furniture:warped_shelf',
  'xp_furniture:pale_oak_shelf',
];
var et = ['north', 'south', 'east', 'west'],
  Fn = { 0: 'north', 1: 'east', 2: 'south', 3: 'west' },
  Bt = class {
    static handlePlayerPlaceBlock(r) {
      let t = r.block;
      if (!Dt.find((i) => t?.typeId === i)) return;
      let o = y.getPlayerCardinalDirection(r.player);
      (gi(t, Fn[o]), et.forEach((i) => gi(t[i](), Fn[o])));
    }
    static handlePlayerBreakBlock(r) {
      let t = r.block.dimension.getBlock(r.block.location),
        n = y.getPlayerCardinalDirection(r.player);
      et.forEach((o) => Hu(t[o](), Fn[n], o === 'north' || o === 'south' ? 'x' : 'z'));
    }
  };
(d([Ge], Bt, 'handlePlayerPlaceBlock', 1), d([_r], Bt, 'handlePlayerBreakBlock', 1));
function hi(e, r, t) {
  let n = Dt.find((o) => e.typeId === o);
  n &&
    e.setPermutation(
      Nu.resolve(n, { 'minecraft:cardinal_direction': r, 'xp_furniture:support': t }),
    );
}
function gi(e, r) {
  let t = Dt.find((i) => e.typeId === i);
  if (!t) return;
  let n = et.reduce((i, a) => i + (q.isIgnoredBlock(e[a](), t) ? 1 : 0), 0),
    o = !(
      et.slice(0, 2).every((i) => {
        try {
          return e[i]()?.permutation.matches(t);
        } catch {
          return !1;
        }
      }) ||
      et.slice(2, 4).every((i) => {
        try {
          return e[i]()?.permutation.matches(t);
        } catch {
          return !1;
        }
      }) ||
      n === 4
    );
  hi(e, r, o);
}
function Hu(e, r, t) {
  let n = Dt.find((a) => e.typeId === a);
  if (!n) return;
  let o = et.reduce((a, u) => a + (q.isIgnoredBlock(e[u](), n) ? 1 : 0), 0),
    i = !(
      (t === 'x' && e.east()?.permutation.matches(n) && e.west()?.permutation.matches(n)) ||
      (t === 'z' && e.north()?.permutation.matches(n) && e.south()?.permutation.matches(n)) ||
      o === 4
    );
  hi(e, r, i);
}
import {
  BlockExplodeAfterEvent as Qu,
  PlayerBreakBlockAfterEvent as ju,
  system as Gn,
  world as bi,
} from '@minecraft/server';
var $n = h.getLogger('HangingLeaves'),
  me = class {
    constructor() {
      Gn.run(() => {
        (bi.afterEvents.playerBreakBlock.subscribe(this.onPlayerBreakWorld.bind(this)),
          bi.afterEvents.blockExplode.subscribe(this.onPlayerBreakWorld.bind(this)));
      });
    }
    onPlace(r, t) {
      let n = r.block.above();
      if (n && n.hasTag(me.blockTag)) {
        let o = n.permutation.getAllStates();
        if (o['xp_furniture:lower_bit'] === void 0) {
          $n.error(`Block ${n.typeId} does not have the 'xp_furniture:lower_bit' state.`);
          return;
        }
        ((o['xp_furniture:lower_bit'] = 0), n.setPermutation(Q(n.typeId, o)));
      }
    }
    onPlayerBreak(r, t) {
      let n = r.block.above();
      if (!n) return;
      if (n.hasTag(me.blockTag)) {
        let i = n.permutation.getAllStates();
        if (i['xp_furniture:lower_bit'] === void 0) {
          $n.error(`Block ${n.typeId} does not have the 'xp_furniture:lower_bit' state.`);
          return;
        }
        ((i['xp_furniture:lower_bit'] = 1), n.setPermutation(Q(n.typeId, i)));
      }
      let o = r.brokenBlockPermutation.getState('xp_furniture:lower_bit');
      o !== void 0 && o === 0 && Gn.waitTicks(1).then(() => this.destroyBelow(r.block.below()));
    }
    onPlayerBreakWorld(r) {
      let t = !1,
        n;
      if (r instanceof ju) n = r.brokenBlockPermutation;
      else if (r instanceof Qu) ((t = !0), (n = r.explodedBlockPermutation));
      else return;
      if (n.hasTag(me.blockTag) && !t) return;
      let o = r.block.below();
      o && o.hasTag(me.blockTag) && this.destroyBelow(o);
    }
    destroyBelow(r) {
      if (r && r.hasTag(me.blockTag)) {
        let t = r.location,
          n = r.permutation.getState('xp_furniture:lower_bit');
        try {
          (r.dimension.runCommand(`setblock ${t.x} ${t.y} ${t.z} air destroy`),
            n !== void 0 && n === 0 && Gn.waitTicks(1).then(() => this.destroyBelow(r.below())));
        } catch (o) {
          $n.error(`Failed to destroy block at ${t.x}, ${t.y}, ${t.z}: ${o}`);
        }
      }
    }
  };
((me.componentId = 'xp_furniture:hanging_leaves'),
  (me.blockTag = 'xp_furniture:hanging_leaves'),
  d([m], me.prototype, 'onPlace', 1),
  d([m], me.prototype, 'onPlayerBreak', 1),
  (me = d([x], me)));
import { Direction as Vu, system as on } from '@minecraft/server';
var G = class {
  constructor() {
    this.blockId = 'xp_furniture:icicle';
    ((this.beforeOnPlayerPlace = this.beforeOnPlayerPlace.bind(this)),
      (this.onPlayerDestroy = this.onPlayerDestroy.bind(this)));
  }
  beforeOnPlayerPlace(r) {
    let t = r.block.above(),
      n = r.block.below(),
      o = r.player?.isSneaking ?? !1,
      i = {};
    if (r.face === Vu.Up) i[G.reversedState] = 0;
    else {
      i[G.reversedState] = 1;
      let a = t;
      ((t = n), (n = a));
    }
    (t && !t.isAir
      ? (G.log.info('here'), o ? (i[G.partState] = 3) : (i[G.partState] = 4))
      : (G.log.info('or here'), (i[G.partState] = 3)),
      (r.permutationToPlace = Q(this.blockId, i)),
      on.waitTicks(1).then(() => {
        t && t.typeId === this.blockId && n && n.typeId === this.blockId
          ? (o || this.updateStates(t), this.updateStates(n))
          : n && n.typeId === this.blockId
            ? this.updateStates(n)
            : t && t.typeId === this.blockId && !o && this.updateStates(t);
      }));
  }
  updateStates(r) {
    let t = r.permutation.getState(G.reversedState) === 1,
      n,
      o;
    if ((t ? ((n = r.below()), (o = r.above())) : ((n = r.above()), (o = r.below())), !n || !o)) {
      G.log.fatal(`Icicle block is missing a block ${t ? 'below' : 'above'}`);
      return;
    }
    let i = {},
      a = r.permutation.getState(G.partState),
      u;
    try {
      u = n.permutation.getState(G.partState);
    } catch {
      u = -1;
    }
    if ((a === 1 && (u === 1 || u === 2)) || (a === 0 && (u === 1 || u === 2))) return;
    (G.log.info('Destroying icicle', n.typeId, '<', u, '>', o.typeId), u || (u = -1));
    let _ = (n.permutation.getState(G.reversedState) === 1) === t;
    ((i[G.reversedState] = t ? 1 : 0),
      o.typeId === this.blockId
        ? u === -1
          ? (i[G.partState] = 3)
          : u >= 3 && _
            ? (i[G.partState] = 2)
            : u >= 3 && !_
              ? (i[G.partState] = 4)
              : (u === 2 || u === 1) && (i[G.partState] = 1)
        : u === -1
          ? (i[G.partState] = 3)
          : u >= 3 && _
            ? (i[G.partState] = 2)
            : u === 2 || u === 1
              ? (i[G.partState] = 0)
              : (i[G.partState] = 4),
      r.setPermutation(Q(this.blockId, i)),
      on.waitTicks(1).then(() => {
        (o.permutation.getState(G.reversedState) === 1) === t &&
          (o.typeId === this.blockId && this.updateStates(o),
          i[G.partState] === 4 && u !== 4 && this.updateStates(n));
      }));
  }
  onPlayerDestroy(r) {
    G.log.info('Hanging tissue destroyed');
    let t = r.block,
      n = t.above(),
      o = t.below();
    if (!n || !o) {
      G.log.fatal('Cannot find top/bottom block', n, o);
      return;
    }
    let i = r.brokenBlockPermutation.getState(G.reversedState) === 1;
    if (i) {
      let a = n;
      ((n = o), (o = a));
    }
    on.waitTicks(1)
      .then(() => {
        (n && n.typeId === this.blockId && this.destroy(n, i),
          o && o.typeId === this.blockId && this.updateStates(o));
      })
      .catch((a) => {
        G.log.error('Error destroying icicle', a);
      });
  }
  destroy(r, t) {
    let n = t ? r.below() : r.above(),
      o = r.permutation.getState(G.reversedState) === 1;
    if (o !== t) {
      this.updateStates(r);
      return;
    }
    if (
      (r.dimension.runCommand(`setblock ${f.from(r.location).toString('short', ' ')} air destroy`),
      n && n.typeId === this.blockId)
    ) {
      let i = n.permutation.getState(G.reversedState) === 1;
      on.waitTicks(1)
        .then(() => {
          i !== o ? this.updateStates(n) : this.destroy(n, i);
        })
        .catch((a) => {
          G.log.error('Error destroying icicle', a);
        });
    }
  }
};
((G.componentId = 'xp_furniture:icicle'),
  (G.partState = 'xp_furniture:hanging_part'),
  (G.reversedState = 'xp_furniture:is_reversed'),
  (G.log = h.getLogger('IcicleComponent')),
  (G = d([x], G)));
import { BlockPermutation as xi } from '@minecraft/server';
var Nn = [
  'xp_furniture:dog_wood_leaves',
  'xp_furniture:dog_wood_leaves_full',
  'xp_furniture:golden_chain_leaves',
  'xp_furniture:golden_chain_leaves_full',
  'xp_furniture:orange_acacia_leaves',
  'xp_furniture:orange_acacia_leaves_full',
  'xp_furniture:willow_leaves',
  'xp_furniture:willow_leaves_full',
  'xp_furniture:wisteria_leaves',
  'xp_furniture:wisteria_leaves_full',
  'xp_furniture:yellow_birch_leaves',
  'xp_furniture:yellow_birch_leaves_full',
];
var Hn = ['north', 'south', 'east', 'west', 'above', 'below'],
  an = class an {
    static checkAndUpdateLeaves(r) {
      let t = r.block.dimension.getBlock(r.block.location);
      Hn.forEach((n) => {
        let o = t[n]();
        Nn.find((a) => o.permutation.matches(a)) && an.updateLeaves(o);
      });
    }
    static updateLeaves(r) {
      let t = Nn.find((a) => r.permutation.matches(a));
      if (!t) return;
      let n = Hn.every((a) => r[a]().isAir),
        o = Hn.some((a) => r[a]().isAir),
        i = r.permutation.getAllStates();
      !n && !o && !t.includes('full')
        ? r.setPermutation(xi.resolve(t + '_full', i))
        : r.setPermutation(xi.resolve(t.replace('_full', ''), i));
    }
  };
d([Ge, _r], an, 'checkAndUpdateLeaves', 1);
var At = an;
import {
  BlockPermutation as Xu,
  EquipmentSlot as Yu,
  GameMode as Ku,
  ItemComponentTypes as Zu,
  system as vi,
} from '@minecraft/server';
var Qn = [
  'xp_furniture:copper_roof',
  'xp_furniture:red_brick_roof',
  'xp_furniture:slate_roof',
  'xp_furniture:thatch_roof',
  'xp_furniture:waxed_copper_roof',
  'xp_furniture:mossy_roof',
  'xp_furniture:blackstone_roof',
  'xp_furniture:copper_roof_glass',
  'xp_furniture:dark_roof_glass',
  'xp_furniture:white_roof_glass',
];
var jn = h.getLogger('RoofComponent', 'Connective', 'RoofComponent'),
  Si = [
    {
      for: 'corner_outer_south_west',
      around: [
        ['corner_inner_south_west', 'west'],
        null,
        ['corner_inner_south_west', 'south'],
        null,
      ],
    },
    {
      for: 'corner_outer_south_west',
      around: [
        ['corner_outer_north_west', 'west'],
        null,
        ['corner_outer_south_east', 'south'],
        null,
      ],
    },
    {
      for: 'corner_outer_south_east',
      around: [
        ['corner_inner_south_east', 'east'],
        null,
        null,
        ['corner_inner_south_east', 'south'],
      ],
    },
    {
      for: 'corner_outer_south_east',
      around: [
        ['corner_outer_south_east', 'east'],
        null,
        null,
        ['corner_outer_south_west', 'south'],
      ],
    },
    {
      for: 'corner_outer_north_west',
      around: [
        null,
        ['corner_inner_north_west', 'west'],
        ['corner_inner_north_west', 'north'],
        null,
      ],
    },
    {
      for: 'corner_outer_north_west',
      around: [
        null,
        ['corner_outer_south_west', 'west'],
        ['corner_outer_north_east', 'north'],
        null,
      ],
    },
    {
      for: 'corner_outer_north_east',
      around: [
        null,
        ['corner_inner_north_east', 'east'],
        null,
        ['corner_inner_north_east', 'north'],
      ],
    },
    {
      for: 'corner_outer_north_east',
      around: [
        null,
        ['corner_outer_south_east', 'east'],
        null,
        ['corner_outer_north_west', 'north'],
      ],
    },
    {
      for: 'corner_inner_south_west',
      around: [
        null,
        ['corner_outer_south_west', 'west'],
        null,
        ['corner_outer_south_west', 'south'],
      ],
    },
    {
      for: 'corner_inner_south_east',
      around: [
        null,
        ['corner_outer_south_east', 'east'],
        ['corner_outer_south_east', 'south'],
        null,
      ],
    },
    {
      for: 'corner_inner_north_west',
      around: [
        ['corner_outer_north_west', 'west'],
        null,
        null,
        ['corner_outer_north_west', 'north'],
      ],
    },
    {
      for: 'corner_inner_north_east',
      around: [
        ['corner_outer_north_east', 'east'],
        null,
        ['corner_outer_north_east', 'north'],
        null,
      ],
    },
    { for: 'tip_all', around: ['any', 'any', 'any', 'any'] },
    { for: 'tip_north_south', around: ['any', 'any', 'not', 'not'] },
    { for: 'tip_west_east', around: ['not', 'not', 'any', 'any'] },
    { for: 'tip_north', around: [null, 'any', 'any', 'any'] },
    { for: 'tip_south', around: ['any', null, 'any', 'any'] },
    { for: 'tip_east', around: ['any', 'any', null, 'any'] },
    { for: 'tip_west', around: ['any', 'any', 'any', null] },
  ],
  wi = [
    ...Si,
    {
      for: 'corner_outer_south_west',
      around: [null, null, ['corner_inner_south_west', 'south'], null],
      selfMustBe: 'west',
    },
    {
      for: 'corner_outer_south_east',
      around: [['corner_inner_south_east', 'east'], null, null, null],
      selfMustBe: 'south',
    },
    {
      for: 'corner_outer_north_west',
      around: [null, ['corner_inner_north_west', 'west'], null, null],
      selfMustBe: 'north',
    },
    {
      for: 'corner_outer_north_east',
      around: [null, null, ['corner_inner_north_east', 'north'], null],
      selfMustBe: 'east',
    },
  ];
function ki(e, r, t) {
  vi.run(() => {
    let n = {
      ...(r !== void 0 && { 'xp_furniture:direction': r }),
      ...(t !== void 0 && { 'xp_furniture:connection': t }),
    };
    e.setPermutation(Un(e.permutation, n));
  });
}
function Un(e, r) {
  return Xu.resolve(e.type.id, { ...e.getAllStates(), ...r });
}
function Vn(e, r, t, n, o) {
  let i = (s) =>
      (s?.dir === t.dir && (s?.con === void 0 || s?.con === t.con)) ||
      (s?.name === 'any' && /^xp_furniture:.*_roof$/.test(t.typeId)) ||
      (s?.name === 'not' && !/^xp_furniture:.*_roof$/.test(t.typeId)),
    a = Array.isArray(r) ? r.some(i) : i(r),
    u = !n || n.dir === e.getState('xp_furniture:direction'),
    _ = e.getState('minecraft:vertical_half') === o;
  return a && u && _;
}
var lr = class {
  beforeOnPlayerPlace(r) {
    let { block: t, permutationToPlace: n, player: o } = r;
    if (!Qn.find((p) => n.type.id === p) || !o) return;
    let a = n.getState('minecraft:vertical_half'),
      u = y.getPlayerCardinalDirection(o);
    ({ 0: ['east', 'west'], 2: ['east', 'west'], 3: ['north', 'south'], 1: ['north', 'south'] })[
      u
    ].forEach((p) => {
      let w = t[p]();
      if (!w || !/^xp_furniture:.*_roof$/.test(w.typeId)) return;
      let C = ['south', 'north', 'west', 'east'].map((P) => w[P]());
      for (let { for: P, around: O, selfMustBe: F } of wi) {
        let B = O.map((N) =>
            Array.isArray(N)
              ? N.map((K) => Ae.find((Se) => Se.name === K))
              : Ae.find((K) => K.name === N),
          ),
          A = Ae.find((N) => N.name === F);
        if (
          B.every((N, K) => {
            if (N !== void 0) {
              let Se = {
                typeId: C[K]?.typeId ?? 'none',
                dir: C[K]?.permutation.getState('xp_furniture:direction') ?? u,
                con: C[K]?.permutation.getState('xp_furniture:connection') ?? void 0,
              };
              return Vn(w.permutation, N, Se, A, a);
            }
            return !0;
          })
        ) {
          let N = Ae.find((K) => K.name === P);
          (jn.info('Updating neighbor stair block', P), ki(w, N?.dir, N?.con));
          break;
        }
      }
    });
    let s = r.permutationToPlace,
      c = {
        same: ['south', 'north', 'west', 'east'].map((p) => t[p]()),
        below: ['south', 'north', 'west', 'east'].map((p) => t.below()[p]()),
      };
    for (let { for: p, around: w, selfMustBe: C } of Si) {
      let P = w.map((B) =>
          Array.isArray(B)
            ? B.map((A) => Ae.find(($) => $.name === A))
            : Ae.find((A) => A.name === B),
        ),
        O = Ae.find((B) => B.name === C);
      if (
        P.every((B, A) => {
          if (B !== void 0) {
            let $ = c[p.startsWith('tip') ? 'below' : 'same'][A],
              N = {
                typeId: $?.typeId ?? 'none',
                dir: $?.permutation.getState('xp_furniture:direction') ?? u,
                con: $?.permutation.getState('xp_furniture:connection') ?? void 0,
              };
            return Vn(r.permutationToPlace, B, N, O, a);
          }
          return !0;
        })
      ) {
        let B = Ae.find((A) => A.name === p);
        (jn.info('Updating stair block', p),
          (s = Un(r.permutationToPlace, {
            ...(B?.dir !== void 0 && { 'xp_furniture:direction': B?.dir }),
            ...(B?.con !== void 0 && { 'xp_furniture:connection': B?.con }),
            ...(B?.tip !== void 0 && { 'xp_furniture:tip_part': B?.tip }),
            ...(r.permutationToPlace.type.id === 'xp_furniture:mossy_roof' && {
              'xp_furniture:flower_bit': Math.random() > 0.6 ? 0 : 1,
            }),
          })));
        break;
      } else
        s = Un(r.permutationToPlace, {
          'xp_furniture:direction': u,
          'xp_furniture:connection': 1,
          ...(r.permutationToPlace.type.id === 'xp_furniture:mossy_roof' && {
            'xp_furniture:flower_bit': Math.random() > 0.6 ? 0 : 1,
          }),
        });
    }
    r.permutationToPlace = s;
  }
  onPlayerBreak(r) {
    let { block: t, brokenBlockPermutation: n } = r;
    Qn.find((i) => n.type.id === i) &&
      Iu.forEach((i) => {
        let a = t[i]();
        if (!a || !/^xp_furniture:.*_roof$/.test(a.typeId)) return;
        let u = ['south', 'north', 'west', 'east'].map((_) => a[_]());
        for (let { for: _, around: s, selfMustBe: c } of wi) {
          let p = s.map((P) =>
              Array.isArray(P)
                ? P.map((O) => Ae.find((F) => F.name === O))
                : Ae.find((O) => O.name === P),
            ),
            w = Ae.find((P) => P.name === c);
          if (
            p.every((P, O) => {
              if (P !== void 0) {
                let F = {
                  typeId: u[O]?.typeId ?? 'none',
                  dir: u[O]?.permutation.getState('xp_furniture:direction'),
                  con: u[O]?.permutation.getState('xp_furniture:connection'),
                };
                return Vn(a.permutation, P, F, w, n.getState('minecraft:vertical_half'));
              }
              return !0;
            })
          ) {
            let P = Ae.find((O) => O.name === _);
            (jn.info('Updating neighbor stair block due to removal', _), ki(a, P?.dir, P?.con));
            break;
          }
        }
      });
  }
  static onShearUseMossRoof(r) {
    let { block: t, isFirstEvent: n, itemStack: o, player: i } = r;
    if (!n || !o) return;
    let a = 'xp_furniture:flower_bit',
      u = t.typeId === 'xp_furniture:mossy_roof',
      _ = t.permutation.getState(a) !== 0,
      s = o.typeId === 'minecraft:shears';
    !u ||
      !_ ||
      !s ||
      vi.run(() => {
        if (
          (t.setPermutation(t.permutation.withState(a, 0)),
          t.dimension.playSound('mob.sheep.shear', t.location),
          i.getGameMode() === Ku.Creative)
        )
          return;
        let c = o.getComponent(Zu.Durability);
        if (!c) return;
        let p = o;
        (c.damage >= c.maxDurability - 1
          ? ((p = void 0), t.dimension.playSound('random.break', i.location))
          : (c.damage += 1),
          y.getEquippableComponent(i)?.setEquipment(Yu.Mainhand, p));
      });
  }
};
((lr.componentId = 'xp_furniture:roof'),
  d([m], lr.prototype, 'beforeOnPlayerPlace', 1),
  d([m], lr.prototype, 'onPlayerBreak', 1),
  d([Mt], lr, 'onShearUseMossRoof', 1),
  (lr = d([x], lr)));
var Iu = ['north', 'south', 'east', 'west'],
  Ae = [
    { name: 'any' },
    { name: 'not' },
    { name: 'south', dir: 0 },
    { name: 'west', dir: 1 },
    { name: 'north', dir: 2 },
    { name: 'east', dir: 3 },
    { name: 'corner_outer_south_east', dir: 0, con: 2 },
    { name: 'corner_outer_south_west', dir: 1, con: 2 },
    { name: 'corner_outer_north_west', dir: 2, con: 2 },
    { name: 'corner_outer_north_east', dir: 3, con: 2 },
    { name: 'corner_inner_south_east', dir: 0, con: 3 },
    { name: 'corner_inner_south_west', dir: 1, con: 3 },
    { name: 'corner_inner_north_west', dir: 2, con: 3 },
    { name: 'corner_inner_north_east', dir: 3, con: 3 },
    { name: 'tip_all', tip: 1 },
    { name: 'tip_north_south', dir: 0, tip: 2 },
    { name: 'tip_west_east', dir: 1, tip: 2 },
    { name: 'tip_west', dir: 0, tip: 3 },
    { name: 'tip_south', dir: 1, tip: 3 },
    { name: 'tip_east', dir: 2, tip: 3 },
    { name: 'tip_north', dir: 3, tip: 3 },
  ];
import {
  Direction as sr,
  EquipmentSlot as Jn,
  GameMode as Ci,
  ItemStack as yi,
  system as Pi,
} from '@minecraft/server';
var Tu = {
    [sr.North]: 'north',
    [sr.South]: 'south',
    [sr.East]: 'east',
    [sr.West]: 'west',
    [sr.Up]: 'above',
    [sr.Down]: 'below',
  },
  _e = class {
    constructor() {
      this.log = h.getLogger('SlabComponent');
    }
    beforeOnPlayerPlace(r) {
      let { permutationToPlace: t, block: n, face: o, dimension: i, player: a } = r;
      if (!a) return;
      let u = n[Tu[Fe.Opposites[o]]]();
      if (!u || u.typeId !== t.type.id) return;
      let _ = u.permutation.getAllStates(),
        s = _[_e.isDoubleState];
      if (!(s === void 0 || s)) {
        if (_[_e.isTopState] === 'bottom' && o === sr.Up) {
          ((r.cancel = !0),
            Pi.run(() => {
              this.mergeSlabs(u, a, _);
            }));
          return;
        }
        if (_[_e.isTopState] === 'top' && o === sr.Down) {
          ((r.cancel = !0),
            Pi.run(() => {
              this.mergeSlabs(u, a, _);
            }));
          return;
        }
      }
    }
    onPlayerDestroy(r) {
      let { brokenBlockPermutation: t, dimension: n, block: o, player: i } = r;
      t.getState(_e.isDoubleState) &&
        i &&
        i.getGameMode() === Ci.Survival &&
        n.spawnItem(new yi(t.type.id, 1), o.location);
    }
    mergeSlabs(r, t, n) {
      if (
        ((n[_e.isDoubleState] = !0),
        r.setPermutation(Q(r.typeId, n)),
        t.getGameMode() === Ci.Survival)
      ) {
        let o = y.getEquippableComponent(t);
        if (!o) return;
        let i = o.getEquipment(Jn.Mainhand);
        if (!i) return;
        let a = i.amount - 1;
        a === 0
          ? o.setEquipment(Jn.Mainhand, void 0)
          : o.setEquipment(Jn.Mainhand, new yi(i.type, a));
      }
      r.dimension.playSound('dig.stone', r.location);
    }
  };
((_e.componentId = 'xp_furniture:slab'),
  (_e.isDoubleState = 'xp_furniture:is_double'),
  (_e.isTopState = 'minecraft:vertical_half'),
  d([m], _e.prototype, 'beforeOnPlayerPlace', 1),
  d([m], _e.prototype, 'onPlayerDestroy', 1),
  (_e = d([x], _e)));
import { BlockPermutation as Di, system as e_ } from '@minecraft/server';
var Ei = [
  'xp_furniture:acacia_fence',
  'xp_furniture:bamboo_fence',
  'xp_furniture:birch_fence',
  'xp_furniture:cherry_fence',
  'xp_furniture:crimson_fence',
  'xp_furniture:dark_oak_fence',
  'xp_furniture:jungle_fence',
  'xp_furniture:mangrove_fence',
  'xp_furniture:oak_fence',
  'xp_furniture:spruce_fence',
  'xp_furniture:warped_fence',
  'xp_furniture:pale_oak_fence',
  'xp_furniture:paper_divider',
  'xp_furniture:woven_divider',
  'xp_furniture:andesite_brick_wall',
  'xp_furniture:large_andesite_brick_wall',
  'xp_furniture:calcite_brick_wall',
  'xp_furniture:large_calcite_brick_wall',
  'xp_furniture:diorite_brick_wall',
  'xp_furniture:large_diorite_brick_wall',
  'xp_furniture:granite_brick_wall',
  'xp_furniture:large_granite_brick_wall',
];
var Xe = class {
  beforeOnPlayerPlace(r) {
    let { block: t, permutationToPlace: n } = r;
    r.permutationToPlace = Di.resolve(n.type.id, Bi(t));
  }
};
((Xe.componentId = 'xp_furniture:wall_like'),
  (Xe.wallStates = [
    'xp_furniture:is_placed',
    'xp_furniture:post',
    'xp_furniture:north',
    'xp_furniture:south',
    'xp_furniture:east',
    'xp_furniture:west',
  ]),
  d([m], Xe.prototype, 'beforeOnPlayerPlace', 1),
  (Xe = d([x], Xe)));
var wallUpdateQueue = [],
  wallUpdateKeys = new Set(),
  wallUpdateJobRunning = !1,
  Xn = class {
    static connectionUpdate(r) {
      (enqueueAffectedWalls(r.block), startWallUpdateJob());
    }
  };
d([Ge, _r], Xn, 'connectionUpdate', 1);
function enqueueWall(e) {
  if (!e || !Yn(e)) return;
  let r = e.location,
    t = `${e.dimension.id}:${r.x},${r.y},${r.z}`;
  wallUpdateKeys.has(t) ||
    (wallUpdateKeys.add(t),
    wallUpdateQueue.push({
      key: t,
      dimension: e.dimension,
      location: { x: r.x, y: r.y, z: r.z },
    }));
}
function enqueueAffectedWalls(e) {
  for (let r of [e, e?.north(), e?.east(), e?.south(), e?.west(), e?.below()]) enqueueWall(r);
}
function startWallUpdateJob() {
  wallUpdateJobRunning ||
    wallUpdateQueue.length === 0 ||
    ((wallUpdateJobRunning = !0), e_.runJob(r_()));
}
function* r_() {
  for (; wallUpdateQueue.length > 0; ) {
    let e = wallUpdateQueue.pop();
    wallUpdateKeys.delete(e.key);
    try {
      let r = e.dimension.getBlock(e.location);
      if (!r || !Yn(r)) {
        yield;
        continue;
      }
      let t = r.permutation.getAllStates(),
        n = Bi(r);
      if (Object.entries(n).some(([o, i]) => t[o] !== i)) {
        (r.setPermutation(Di.resolve(r.typeId, n)), enqueueWall(r.below()));
      }
    } catch {}
    yield;
  }
  wallUpdateJobRunning = !1;
  wallUpdateQueue.length > 0 && startWallUpdateJob();
}
function Yn(e) {
  return Ei.some((r) => e.matches(r));
}
function Bi(e) {
  let r = e?.above(),
    t = e?.north(),
    n = e?.south(),
    o = e?.east(),
    i = e?.west(),
    a = !q.isIgnoredBlock(t),
    u = !q.isIgnoredBlock(n),
    _ = !q.isIgnoredBlock(o),
    s = !q.isIgnoredBlock(i),
    c = {
      ...e.permutation.getAllStates(),
      'xp_furniture:north': a,
      'xp_furniture:south': u,
      'xp_furniture:east': _,
      'xp_furniture:west': s,
    };
  if (e.typeId.endsWith('_wall') && r) {
    let p = r.permutation.getAllStates(),
      w = !q.isIgnoredBlock(r) && !Yn(r),
      C = !q.isIgnoredBlock(r) && r?.permutation.getState('xp_furniture:post') === !0,
      P = a && u && !_ && !s,
      O = _ && s && !a && !u;
    ((c['xp_furniture:post'] = !(P || O) || C),
      (p['xp_furniture:north'] > 0 || w) && a && (c['xp_furniture:north'] = 2),
      (p['xp_furniture:south'] > 0 || w) && u && (c['xp_furniture:south'] = 2),
      (p['xp_furniture:east'] > 0 || w) && _ && (c['xp_furniture:east'] = 2),
      (p['xp_furniture:west'] > 0 || w) && s && (c['xp_furniture:west'] = 2));
  }
  for (let [p, w] of Object.entries(c)) Xe.wallStates.includes(p) || delete c[p];
  return c;
}
import { BlockPermutation as Ai, system as t_ } from '@minecraft/server';
var un = ['above', 'east', 'north', 'south', 'west', 'below'],
  dr = class {
    beforeOnPlayerPlace(r) {
      let { player: t, block: n, permutationToPlace: o } = r;
      if (!t || (o.type.id === 'xp_furniture:rope' && t?.isSneaking)) return;
      let i = o.getAllStates();
      for (let a = 0; a < 6; a++) {
        let u = un[a],
          _ = n[u](),
          s = t.isSneaking ? o.type.id == _?.type.id : !q.isIgnoredBlock(_);
        (u == 'above' && i['xp_furniture:up'] != null && (u = 'up'),
          u == 'below' && i['xp_furniture:down'] != null && (u = 'down'),
          (i[`xp_furniture:${u}`] = s),
          o.type.id == 'xp_furniture:rope' &&
            n.below()?.getComponent('xp_furniture:hanging_flower_pot') &&
            (i['xp_furniture:down'] = !0),
          i[`xp_furniture:${u}`] &&
            _.type.id == o.type.id &&
            t_.run(() => this.updateConnection(_, un[a * -1 + 5], o.type.id, !0)));
      }
      (i['xp_furniture:is_placed'] != null && (i['xp_furniture:is_placed'] = !0),
        (r.permutationToPlace = Ai.resolve(o.type.id, i)));
    }
    onPlayerBreak(r) {
      let { block: t, brokenBlockPermutation: n } = r;
      for (let o = 0; o < 6; o++) {
        let i = un[o];
        n.type.id == t[i]().type.id && this.updateConnection(t[i](), un[o * -1 + 5], n.type.id, !1);
      }
    }
    updateConnection(r, t, n, o) {
      let i = r.permutation.getAllStates(),
        a = t;
      (a == 'above' && i['xp_furniture:up'] != null && (a = 'up'),
        a == 'below' && i['xp_furniture:down'] != null && (a = 'down'),
        (i[`xp_furniture:${a}`] = o),
        r.type.id == 'xp_furniture:rope' &&
          r.below()?.getComponent('xp_furniture:hanging_flower_pot') &&
          (i['xp_furniture:down'] = !0));
      let u = Ai.resolve(n, i);
      return r.setPermutation(u);
    }
  };
((dr.componentId = 'xp_furniture:xyz_connective'),
  d([m], dr.prototype, 'beforeOnPlayerPlace', 1),
  d([m], dr.prototype, 'onPlayerBreak', 1),
  (dr = d([x], dr)));
import { BlockPermutation as i_, system as a_ } from '@minecraft/server';
var _n = [
  { id: 'xp_furniture:acacia_lamp', auxId: 'xp_furniture:lamp' },
  { id: 'xp_furniture:bamboo_lamp', auxId: 'xp_furniture:lamp' },
  { id: 'xp_furniture:birch_lamp', auxId: 'xp_furniture:lamp' },
  { id: 'xp_furniture:cherry_lamp', auxId: 'xp_furniture:lamp' },
  { id: 'xp_furniture:crimson_lamp', auxId: 'xp_furniture:lamp' },
  { id: 'xp_furniture:dark_oak_lamp', auxId: 'xp_furniture:lamp' },
  { id: 'xp_furniture:jungle_lamp', auxId: 'xp_furniture:lamp' },
  { id: 'xp_furniture:mangrove_lamp', auxId: 'xp_furniture:lamp' },
  { id: 'xp_furniture:oak_lamp', auxId: 'xp_furniture:lamp' },
  { id: 'xp_furniture:spruce_lamp', auxId: 'xp_furniture:lamp' },
  { id: 'xp_furniture:warped_lamp', auxId: 'xp_furniture:lamp' },
  { id: 'xp_furniture:pale_oak_lamp', auxId: 'xp_furniture:lamp' },
  { id: 'xp_furniture:acacia_standing_lamp', auxId: 'xp_furniture:standing_lamp' },
  { id: 'xp_furniture:bamboo_standing_lamp', auxId: 'xp_furniture:standing_lamp' },
  { id: 'xp_furniture:birch_standing_lamp', auxId: 'xp_furniture:standing_lamp' },
  { id: 'xp_furniture:cherry_standing_lamp', auxId: 'xp_furniture:standing_lamp' },
  { id: 'xp_furniture:crimson_standing_lamp', auxId: 'xp_furniture:standing_lamp' },
  { id: 'xp_furniture:dark_oak_standing_lamp', auxId: 'xp_furniture:standing_lamp' },
  { id: 'xp_furniture:jungle_standing_lamp', auxId: 'xp_furniture:standing_lamp' },
  { id: 'xp_furniture:mangrove_standing_lamp', auxId: 'xp_furniture:standing_lamp' },
  { id: 'xp_furniture:oak_standing_lamp', auxId: 'xp_furniture:standing_lamp' },
  { id: 'xp_furniture:spruce_standing_lamp', auxId: 'xp_furniture:standing_lamp' },
  { id: 'xp_furniture:warped_standing_lamp', auxId: 'xp_furniture:standing_lamp' },
  { id: 'xp_furniture:pale_oak_standing_lamp', auxId: 'xp_furniture:standing_lamp' },
  { id: 'xp_furniture:acacia_table_lamp', auxId: 'xp_furniture:table_lamp' },
  { id: 'xp_furniture:bamboo_table_lamp', auxId: 'xp_furniture:table_lamp' },
  { id: 'xp_furniture:birch_table_lamp', auxId: 'xp_furniture:table_lamp' },
  { id: 'xp_furniture:cherry_table_lamp', auxId: 'xp_furniture:table_lamp' },
  { id: 'xp_furniture:crimson_table_lamp', auxId: 'xp_furniture:table_lamp' },
  { id: 'xp_furniture:dark_oak_table_lamp', auxId: 'xp_furniture:table_lamp' },
  { id: 'xp_furniture:jungle_table_lamp', auxId: 'xp_furniture:table_lamp' },
  { id: 'xp_furniture:mangrove_table_lamp', auxId: 'xp_furniture:table_lamp' },
  { id: 'xp_furniture:oak_table_lamp', auxId: 'xp_furniture:table_lamp' },
  { id: 'xp_furniture:spruce_table_lamp', auxId: 'xp_furniture:table_lamp' },
  { id: 'xp_furniture:warped_table_lamp', auxId: 'xp_furniture:table_lamp' },
  { id: 'xp_furniture:pale_oak_table_lamp', auxId: 'xp_furniture:table_lamp' },
  {
    id: 'xp_furniture:big_gold_candle_holder',
    auxId: 'xp_furniture:candle_holder',
    auxVariant: 0,
    ignite: !0,
  },
  {
    id: 'xp_furniture:big_metal_candle_holder',
    auxId: 'xp_furniture:candle_holder',
    auxVariant: 1,
    ignite: !0,
  },
  {
    id: 'xp_furniture:small_iron_candle_holder',
    auxId: 'xp_furniture:candle_holder',
    auxVariant: 2,
    ignite: !0,
  },
  {
    id: 'xp_furniture:small_metal_candle_holder',
    auxId: 'xp_furniture:candle_holder',
    auxVariant: 3,
    ignite: !0,
  },
  { id: 'xp_furniture:chandelier', auxId: 'xp_furniture:chandelier', ignite: !0 },
  { id: 'xp_furniture:chandelier_golden', auxId: 'xp_furniture:chandelier', ignite: !0 },
  'xp_furniture:grow_lamp',
  'xp_furniture:blackstone_stove',
  'xp_furniture:copper_stove',
  'xp_furniture:iron_stove',
  'xp_furniture:stone_stove',
];
import { EquipmentSlot as o_, GameMode as Wi } from '@minecraft/server';
import { ItemStack as Kn, system as Oi } from '@minecraft/server';
var Li = h.getLogger('FurniturePack', 'Utilities', 'Item'),
  W = class {
    static incrementStack(r, t, n = !1) {
      let o = t instanceof Kn ? t.typeId : t;
      (r.matches({ gameMode: Wi.Creative }) && !n) ||
        Oi.run(() => {
          (y.getInventoryComponent(r).container?.addItem(new Kn(o, 1)),
            Li.info(`Added ${o} to ${r.name}`));
        });
    }
    static decrementStack(r, t, n = !1) {
      let o = t instanceof Kn ? t.typeId : t;
      (!n && r.matches({ gameMode: Wi.Creative })) ||
        Oi.run(() => {
          (r.runCommand(`clear @s ${o} 0 1`), Li.info(`Removed ${o} from ${r.name}`));
        });
    }
    static findItems(r, t = 'all') {
      let n = [],
        o = y.getInventoryComponent(r);
      if (!o) return !1;
      let i = o.container;
      if (!i) return !1;
      for (let a = 0; a < i.size; a++) {
        let u = i.getItem(a);
        t === 'all' && u
          ? n.push({ item: u, slot: a })
          : u?.typeId.includes(t) && n.push({ item: u, slot: a });
      }
      return n;
    }
    static findItem(r, t) {
      let n = this.findItems(r, t);
      return n ? n[0] : !1;
    }
    static findItemsWithLore(r, t, n) {
      let o = this.findItems(r, t);
      if (!o) return !1;
      let i = o.filter((a) => a.item.getLore().some((u) => n.some((_) => u.includes(_))));
      return i.length > 0 ? i : !1;
    }
    static searchItemId(r, t) {
      let n = this.findItems(r, t);
      return n ? n.length > 0 : !1;
    }
    static getHeldItem(r) {
      return y.getEquippableComponent(r)?.getEquipment(o_.Mainhand);
    }
    static compareData(r, t, n) {
      let o = n.dimension.spawnEntity('xp_furniture:inventory', n.location);
      o.runCommand(`replaceitem entity @s slot.inventory 0 ${r.typeId} 1 ${t}`);
      let i = y.getInventoryComponent(n)?.container?.getItem(0);
      return (o.triggerEvent('xp_furniture:despawn'), i ? r.isStackableWith(i) : !1);
    }
    static getHeldItemWithData(r, t = 16) {
      let n = this.getHeldItem(r);
      if (!n) return;
      let o = 0;
      for (let i = 1; i < t; i++) {
        this.compareData(n, i, r) && (o = i);
        break;
      }
      return { item: n, data: o };
    }
  };
var Zn = h.getLogger('FurniturePack', 'Interactive', 'Lightables'),
  cr = class {
    onPlayerInteract(r) {
      let { block: t, player: n } = r;
      if (t.permutation.getState('xp_furniture:lit') === void 0) return;
      let o = t.permutation.getState('xp_furniture:top_piece_bit') === 0 ? t.above() : t;
      if (!o) return;
      let i = o.permutation.getState('xp_furniture:lit'),
        a = _n.find((w) => (typeof w == 'object' ? w.id : w) === o.typeId.replace('_v2', ''));
      if (!a) return;
      let u = typeof a == 'object' ? a.auxId : a,
        _ = typeof a == 'object' && a.auxVariant !== void 0 ? `_${a.auxVariant}` : '',
        s = o.permutation.getState('xp_furniture:top_piece_bit') === 1 ? o.below() : o,
        c = ['minecraft:flint_and_steel', 'minecraft:fire_charge'];
      if (
        n &&
        i === 0 &&
        typeof a == 'object' &&
        a.ignite === !0 &&
        !c.includes(W.getHeldItem(n)?.typeId ?? '')
      )
        return;
      o.setPermutation(o.permutation.withState('xp_furniture:lit', i === 0 ? 1 : 0));
      let p = {
        click: ['xp_furniture:lamp.on', 'xp_furniture:lamp.off'],
        fire: ['fire.ignite', 'random.fizz'],
      };
      (o.dimension.playSound(
        typeof a == 'object' && a.ignite === !0 ? p.fire[i] : p.click[i],
        o.location,
      ),
        i === 0
          ? (q.summonAuxiliaryEntity(s, u, {
              spawnEvent: `xp_furniture:is_uninteractable${_}`,
              centerBlock: !0,
            }),
            Zn.info(`Spawned entity ${u} at`, s.location))
          : s.dimension.getEntitiesAtBlockLocation(s.location).forEach((w) => {
              w.typeId === u &&
                (w.triggerEvent('xp_furniture:despawn'),
                Zn.info(`Despawned entity ${u} at`, s.location));
            }));
      try {
        o.setPermutation(o.permutation.withState('xp_furniture:is_placed', 1));
      } catch {}
    }
    beforeOnPlayerPlace(r) {
      let { permutationToPlace: t } = r;
      t.getState('xp_furniture:is_placed') !== void 0 &&
        (r.permutationToPlace = t.withState('xp_furniture:is_placed', 1));
    }
    onPlayerDestroy(r) {
      let { block: t, brokenBlockPermutation: n } = r;
      if (n.getState('xp_furniture:lit') === void 0) return;
      let o = _n.find((i) => (typeof i == 'object' ? i.id : i) === n.type.id.replace('_v2', ''));
      if (o) {
        let i = typeof o == 'object' ? o.auxId : o,
          a = n.getState('xp_furniture:top_piece_bit') === 1 ? t.below() : t;
        a.dimension.getEntitiesAtBlockLocation(a.location).forEach((u) => {
          u.typeId === i &&
            (u.triggerEvent('xp_furniture:despawn'),
            Zn.info(`Despawned entity ${i} at`, a.location));
        });
      }
    }
  };
((cr.componentId = 'xp_furniture:lightables_v2'),
  d([m], cr.prototype, 'onPlayerInteract', 1),
  d([m], cr.prototype, 'beforeOnPlayerPlace', 1),
  d([m], cr.prototype, 'onPlayerDestroy', 1),
  (cr = d([x], cr)));
function u_(e, r, t) {
  if (t.matches({ families: ['furniture', 'inanimate'] }) && e == 'xp_furniture:lit') {
    let n = t.dimension.getBlock({ x: t.location.x, y: Math.round(t.location.y), z: t.location.z });
    if (n == null) return;
    for (let o of _n)
      n.permutation.matches(typeof o == 'object' ? o.id : o) &&
        n.setPermutation(
          i_.resolve(typeof o == 'object' ? o.id : o, {
            'xp_furniture:is_placed': 1,
            'xp_furniture:lit': parseInt(r),
          }),
        );
  }
}
a_.afterEvents.scriptEventReceive.subscribe(
  (e) => {
    let { id: r, message: t, sourceEntity: n } = e;
    if (n)
      try {
        u_(r, t, n);
      } catch {}
  },
  { namespaces: ['xp_furniture:lightables'] },
);
import { EntityInventoryComponent as __, system as qi, world as l_ } from '@minecraft/server';
var zi = new Map();
l_.beforeEvents.playerInteractWithBlock.subscribe((e) => {
  let { player: r, block: t } = e;
  if (t.typeId !== 'xp_furniture:mossy_roof') return;
  let n = r.id,
    o = zi.get(n) ?? 0,
    i = qi.currentTick;
  if (i - o < 1 || (zi.set(n, i), !r)) return;
  let a = r.getComponent(__.componentId);
  if (!a.isValid) return;
  let _ = a.container.getItem(r.selectedSlotIndex);
  if (_?.typeId !== 'minecraft:bone_meal') return;
  let s = t.dimension,
    c = t.permutation,
    p = 'xp_furniture:flower_bit';
  c.getState(p) !== 1 &&
    (qi.run(() => {
      !t.isValid ||
        !r.isValid ||
        (t.setPermutation(c.withState(p, 1)),
        W.decrementStack(r, _, !1),
        s.spawnParticle('minecraft:crop_growth_emitter', t.center()),
        r.playSound('item.bone_meal.use', {
          location: t.center(),
          pitch: Math.withinRange(0.8, 1.2),
          volume: 1,
        }));
    }),
    (e.cancel = !0));
});
l_.afterEvents.playerLeave.subscribe((e) => zi.delete(e.playerId));
import { Direction as pr } from '@minecraft/server';
var rt = class {
  onPlayerInteract(r) {
    let { block: t, face: n } = r;
    if (typeof t.permutation.getState('xp_furniture:open_state') != 'number') return;
    let o = { [pr.North]: 'south', [pr.South]: 'north', [pr.East]: 'west', [pr.West]: 'east' },
      i = { [pr.North]: 0, [pr.South]: 2, [pr.East]: 1, [pr.West]: 3 },
      a =
        t.permutation.getState('xp_furniture:direction') === 9
          ? o[n] === t.permutation.getState('minecraft:cardinal_direction')
          : i[n] === t.permutation.getState('xp_furniture:direction');
    (t.setPermutation(
      t.permutation.withState(
        'xp_furniture:open_state',
        t.permutation.getState('xp_furniture:open_state') > 0 ? 0 : a ? 1 : 2,
      ),
    ),
      t.dimension.playSound(
        `block.barrel.${t.permutation.getState('xp_furniture:open_state') > 0 ? 'open' : 'close'}`,
        t.location,
      ));
  }
};
((rt.componentId = 'xp_furniture:openable_block'),
  d([m], rt.prototype, 'onPlayerInteract', 1),
  (rt = d([x], rt)));
import { world as s_ } from '@minecraft/server';
var d_ = h.getLogger('Container'),
  c_ = [
    'xp_furniture:cabinet',
    'xp_furniture:counter',
    'xp_furniture:cupboard',
    'xp_furniture:sideboard',
    'xp_furniture:big_chest',
    'xp_furniture:slab_chest',
  ];
function p_(e) {
  let { player: r, target: t } = e,
    n = t.getComponent('minecraft:tamemount');
  n &&
    (d_.info(`Opened by ${r.name}`),
    n.tameToPlayer(!1, r),
    t.triggerEvent('xp_furniture:on_interact'));
}
s_.afterEvents.playerInteractWithEntity.subscribe((e) => {
  c_.filter((r) => e.target.typeId == r).forEach(() => p_(e));
});
import {
  world as he,
  system as ge,
  TicksPerSecond as Tn,
  TimeOfDay as h_,
  Player as b_,
  GameMode as x_,
  EntityRideableComponent as $i,
  EntityRidingComponent as w_,
  WeatherType as Mn,
  Direction as fr,
  InputPermissionCategory as gr,
  EntityHealthComponent as k_,
} from '@minecraft/server';
import { world as Ri } from '@minecraft/server';
import { ModalFormData as f_ } from '@minecraft/server-ui';
function m_(e) {
  switch (e) {
    case 'none':
      return 0;
    case 'christmas':
      return 1;
  }
}
function g_(e) {
  switch (e) {
    case 0:
      return 'none';
    case 1:
      return 'christmas';
    default:
      throw new Error('unreachable');
  }
}
function Ke() {
  let e = Ri.getDynamicProperty(Ye.componentId);
  return e === void 0
    ? { enableFurnitureMerchant: !0, enableInsects: !0, skipNightWithOneBed: !1, event: 'none' }
    : JSON.parse(e);
}
var Ye = class {
  onPlayerInteract(r) {
    let { player: t, dimension: n } = r;
    if (!t) return;
    let o = Ke();
    new f_()
      .title('设置')
      .toggle('启用家具商人', { defaultValue: o.enableFurnitureMerchant })
      .toggle('启用蝴蝶与飞蛾', { defaultValue: o.enableInsects })
      .toggle('一名玩家睡觉即可跳过夜晚', { defaultValue: o.skipNightWithOneBed })
      .dropdown('活动', ['自动', '圣诞节'], { defaultValueIndex: m_(o.event) })
      .show(t)
      .then(({ formValues: i, canceled: a }) => {
        if (!a && i) {
          let u = {
            enableFurnitureMerchant: i[0],
            enableInsects: i[1],
            skipNightWithOneBed: i[2],
            event: g_(i[3]),
          };
          if ((Ri.setDynamicProperty(Ye.componentId, JSON.stringify(u)), i[1] == !1)) {
            let _ = n
              .getEntities()
              .filter((s) => ['xp_furniture:moth', 'xp_furniture:butterfly'].includes(s.typeId));
            for (let s of _) s.remove();
          }
        }
      });
  }
};
((Ye.componentId = 'xp_furniture:settings'),
  d([m], Ye.prototype, 'onPlayerInteract', 1),
  (Ye = d([x], Ye)));
var mr = h.getLogger('FurniturePack', 'Interactive', 'Sittable');
var v_ = [
    'black',
    'blue',
    'brown',
    'cyan',
    'gray',
    'green',
    'light_blue',
    'light_gray',
    'lime',
    'magenta',
    'orange',
    'pink',
    'purple',
    'red',
    'white',
    'yellow',
  ],
  S_ = [...v_.flatMap((e) => `${e}_pet_bed`)],
  Fi = function (e, r) {
    e.sendMessage([{ text: '\xA77' }, { translate: r }, { text: '\xA7r' }]);
  },
  le = class {
    onPlayerInteract(r, t) {
      let n;
      try {
        n = this.convertParams(t.params);
      } catch (s) {
        mr.error(`Failed to convert parameters for ${le.componentId} component:`, s);
        return;
      }
      let o = r.block,
        i = r.player;
      if (!i) {
        mr.error(`Player is undefined in ${le.componentId} component interaction.`);
        return;
      }
      let a = this.toDirection(o.permutation.getState('minecraft:cardinal_direction'));
      if (!a) {
        mr.error(
          `Invalid block direction for ${le.componentId} component:`,
          o.permutation.getState('minecraft:cardinal_direction'),
        );
        return;
      }
      mr.info(a);
      let u = o.dimension.spawnEntity('xp_furniture:seat', f.from(o.bottomCenter()), {
        spawnEvent: n.event,
      });
      (mr.info(this.toRotation(n.rotation, a)), u.setRotation(this.toRotation(n.rotation, a)));
      let _ = u.getComponent($i.componentId);
      if (!_) {
        mr.error(`Entity ${u.typeId} does not have EntityRideableComponent, cannot set rider.`);
        return;
      }
      ge.waitTicks(5).then(() => {
        _.addRider(i);
      });
    }
    onPlayerBreak(r, t) {}
    onBreak(r, t) {}
    convertParams(r) {
      return (this.assertIsSittableComponentData(r), r);
    }
    assertIsSittableComponentData(r) {
      if (typeof r != 'object' || r === null)
        throw new Error(`Invalid data for ${le.componentId} component: ${JSON.stringify(r)}`);
      if (!('event' in r) || typeof r.event != 'string')
        throw new Error(
          `Invalid 'event' property in ${le.componentId} component data: ${JSON.stringify(r)}`,
        );
      if (!('rotation' in r) || typeof r.rotation != 'number')
        throw new Error(
          `Invalid 'rotation' property in ${le.componentId} component data: ${JSON.stringify(r)}`,
        );
      return !0;
    }
    toDirection(r) {
      if (!(r === void 0 || typeof r != 'string'))
        switch (r) {
          case 'north':
            return fr.North;
          case 'east':
            return fr.East;
          case 'south':
            return fr.South;
          case 'west':
            return fr.West;
          default:
            return;
        }
    }
    toRotation(r, t) {
      switch (t) {
        case fr.North:
          return { x: 0, y: r };
        case fr.East:
          return { x: 0, y: r + 90 };
        case fr.South:
          return { x: 0, y: r + 180 };
        case fr.West:
          return { x: 0, y: r + 270 };
        default:
          return (mr.error(`Invalid direction for rotation conversion: ${t}`), { x: 0, y: r });
      }
    }
  };
((le.componentId = 'xp_furniture:sittable'),
  d([m], le.prototype, 'onPlayerInteract', 1),
  d([m], le.prototype, 'onPlayerBreak', 1),
  d([m], le.prototype, 'onBreak', 1),
  (le = d([x], le)));
var In = class {
  static sittablePlayerPlaceBlock(r) {
    let t = r.block,
      n = S_.find((s) => t.permutation.matches(`xp_furniture:${s}`));
    if (!n) return;
    let o = { 0: t?.north(), 1: t?.east(), 2: t?.south(), 3: t?.west() },
      i = { 1: t?.north(), 2: t?.east(), 3: t?.south(), 0: t?.west() },
      a =
        (n.includes('hammock')
          ? i[y.getPlayerCardinalDirection(r.player)]
          : o[y.getPlayerCardinalDirection(r.player)]) || t.east(),
      u = {
        _stool: 'xp_furniture:stool',
        _chair: 'xp_furniture:chair',
        _armchair: 'xp_furniture:armchair',
        _pet_bed: 'xp_furniture:pet_bed',
      },
      _;
    for (let [s, c] of Object.entries(u))
      if (n.endsWith(s)) {
        _ = c;
        break;
      }
    (mr.info(_, n),
      _ &&
        q.summonAuxiliaryEntity(t, 'xp_furniture:seat', {
          spawnEvent: _,
          targetRotation: a?.location,
        }));
  }
};
d([Ge], In, 'sittablePlayerPlaceBlock', 1);
ge.afterEvents.scriptEventReceive.subscribe(
  (e) => {
    let { id: r, sourceEntity: t } = e;
    if (r === 'xp_furniture_bed:sleep' && t !== void 0) {
      if (t.dimension.id !== 'minecraft:overworld') {
        he.gameRules.respawnBlocksExplode &&
          t.dimension.createExplosion(t.location, 5, { causesFire: !0, breaksBlocks: !0 });
        return;
      }
      let n = { 0: 180, 1: -90, 2: 0, 3: 90 },
        o = t?.dimension.getBlock(t.location);
      if (!o) return;
      let i =
        o.permutation.getState('xp_furniture:direction') + (o.typeId.includes('hammock') ? 1 : 0);
      t?.runCommand(`tp @s ~~~ ${n[!i || i > 3 ? 0 : i]} 0`);
      let a = t?.dimension.getEntitiesAtBlockLocation(t?.location);
      if (!a) return;
      for (let u of a)
        if (u instanceof b_) {
          let _ = { dimension: u.dimension, x: u.location.x, y: u.location.y, z: u.location.z };
          (u.setSpawnPoint(_),
            u.sendMessage([
              { text: '\xA77' },
              { translate: 'tile.bed.respawnSet' },
              { text: '\xA7r' },
            ]));
          let s = he.getDynamicProperty('xp_furniture:weather'),
            c = s === Mn.Thunder;
          if (s !== Mn.Thunder && !Math.in_range(he.getTimeOfDay(), 12542, 23459)) {
            Fi(u, 'tile.bed.noSleep');
            return;
          }
          if (
            u.dimension.getEntities({ location: u.location, maxDistance: 9, families: ['monster'] })
              .length > 0 &&
            !u.matches({ gameMode: x_.Creative })
          ) {
            Fi(u, 'tile.bed.notSafe');
            return;
          }
          C_(u, t, o?.typeId.includes('hammock'), c);
          break;
        }
    } else if (r === 'xp_furniture_bed:pet_bed' && t !== void 0) {
      let { sourceEntity: n } = e;
      // Grouping preserves the original optional-chain behavior.
      // prettier-ignore
      (n?.getComponent($i.componentId))
        .getRiders()
        .forEach((a) => {
          let u = a.getComponent(k_.componentId);
          if (
            (a.playAnimation(
              a.typeId === 'minecraft:cat' ? 'animation.cat.sit' : 'animation.wolf.sitting',
              { nextState: 'default', blendOutTime: 0, stopExpression: '!q.is_riding' },
            ),
            !u || u.currentValue === u.effectiveMax)
          )
            return;
          a.addEffect('regeneration', Tn, { amplifier: 3 });
          let _ = ge.runInterval(
            () => {
              (a.playAnimation(
                a.typeId === 'minecraft:cat' ? 'animation.cat.sit' : 'animation.wolf.sitting',
                { nextState: 'default', blendOutTime: 0, stopExpression: '!q.is_riding' },
              ),
                Math.random() > 0.5 &&
                  a.dimension.spawnParticle(
                    'minecraft:heart_particle',
                    f.from(a.location).add({
                      x: Math.withinRange(-0.75, 0.75),
                      y: Math.withinRange(0, 1.5),
                      z: Math.withinRange(-0.75, 0.75),
                    }),
                  ));
            },
            Math.random() * 5 + 5,
          );
          ge.runTimeout(() => {
            ge.clearRun(_);
          }, Tn);
        });
    }
  },
  { namespaces: ['xp_furniture_bed'] },
);
var sleepSessions = new Map(),
  insomniaRestoreRun,
  insomniaOriginalRuleProperty = 'xp_furniture:insomnia_original_rule',
  insomniaRestoreAtProperty = 'xp_furniture:insomnia_restore_at',
  sleepInputLockProperty = 'xp_furniture:sleep_input_locked';
function registerSleepRun(e, r, t = !1) {
  let n = sleepSessions.get(e);
  (n || ((n = { runIds: new Set(), inputLocked: !1 }), sleepSessions.set(e, n)),
    n.runIds.add(r),
    t && (n.inputLocked = !0));
}
function clearSleepRuns(e) {
  let t = sleepSessions.get(e);
  if (t) {
    for (let n of t.runIds) ge.clearRun(n);
    sleepSessions.delete(e);
  }
  return t;
}
function stopSleepSession(e, r) {
  let t = clearSleepRuns(e),
    n = t?.inputLocked;
  if (!r?.isValid) return;
  try {
    n ||= r.getDynamicProperty(sleepInputLockProperty) === !0;
  } catch {}
  try {
    r.removeTag('xp_is_sleeping');
  } catch {}
  try {
    r.camera.clear();
  } catch {}
  if (!n) return;
  try {
    (r.inputPermissions.setPermissionCategory(gr.Movement, !0),
      r.inputPermissions.setPermissionCategory(gr.Camera, !0));
  } catch {}
  try {
    r.setDynamicProperty(sleepInputLockProperty, void 0);
  } catch {}
}
he.afterEvents.playerLeave.subscribe((e) => stopSleepSession(e.playerId));
he.afterEvents.playerSpawn.subscribe((e) => {
  ge.run(() => stopSleepSession(e.player.id, e.player));
});
function restoreInsomniaRule() {
  let e = he.getDynamicProperty(insomniaOriginalRuleProperty);
  ((he.gameRules.doInsomnia = typeof e == 'boolean' ? e : !0),
    (insomniaRestoreRun = void 0),
    he.setDynamicProperty(insomniaRestoreAtProperty, void 0),
    he.setDynamicProperty(insomniaOriginalRuleProperty, void 0));
}
function scheduleInsomniaRestoreAt(e) {
  (insomniaRestoreRun !== void 0 && ge.clearRun(insomniaRestoreRun),
    (insomniaRestoreRun = ge.runTimeout(
      () => {
        try {
          restoreInsomniaRule();
        } catch {
          ((insomniaRestoreRun = void 0), scheduleInsomniaRestoreAt(Date.now() + 60 * 1e3));
        }
      },
      Math.max(1, Math.ceil((e - Date.now()) / 50)),
    )));
}
function scheduleInsomniaRestore() {
  let e = he.getDynamicProperty(insomniaOriginalRuleProperty),
    r = Date.now() + 60 * 60 * 1e3;
  (typeof e != 'boolean' &&
    he.setDynamicProperty(insomniaOriginalRuleProperty, he.gameRules.doInsomnia),
    he.setDynamicProperty(insomniaRestoreAtProperty, r),
    (he.gameRules.doInsomnia = !1),
    scheduleInsomniaRestoreAt(r));
}
he.afterEvents.worldLoad.subscribe(() => {
  let e = he.getDynamicProperty(insomniaRestoreAtProperty),
    r = he.getDynamicProperty(insomniaOriginalRuleProperty);
  (typeof e == 'number'
    ? scheduleInsomniaRestoreAt(e)
    : typeof r == 'boolean' && restoreInsomniaRule(),
    he.getAllPlayers().forEach((r) => stopSleepSession(r.id, r)));
});
function C_(e, r, t = !1, n = !1) {
  let i = e.id;
  stopSleepSession(i, e);
  if (
    (e.runCommand(
      'execute at @e[type=xp_furniture:seat,c=1] run camera @s set minecraft:free pos ^^1.625^-1 rot -33.75 ~',
    ),
    ge.waitTicks(1).then(() => {
      if (!e.isValid) return;
      try {
        e.runCommand(
          'execute at @e[type=xp_furniture:seat,c=1] run camera @s set minecraft:free ease 5 in_out_quad pos ^^1.625^-1.5 rot 33.75 ~',
        );
      } catch {
        stopSleepSession(i, e);
      }
    }),
    y.getAllPlayers().length > 1 && !Ke().skipNightWithOneBed)
  ) {
    (e.addTag('xp_is_sleeping'), e.setDynamicProperty('xp_furniture:sleeping_pos', e.location));
    let o = ge.runInterval(() => {
      if (!e.isValid) {
        stopSleepSession(i);
        return;
      }
      try {
        if (
          (e.playAnimation(`animation.xp_furniture.player.sleep_custom${t ? '_hammock' : ''}`),
          eo(),
          e.onScreenDisplay.setActionBar({
            translate: 'multiplayer.playersSleeping',
            with: [
              he.getDynamicProperty('xp_furniture:sleeping_count').toString(),
              y.getAllPlayers().length.toString(),
            ],
          }),
          he.getDynamicProperty('xp_furniture:sleeping_percentage') === 100)
        ) {
          (clearSleepRuns(i), Gi(e, r, t, n));
          return;
        }
        f.from(e.location).distanceSquared(e.getDynamicProperty('xp_furniture:sleeping_pos')) > 1 &&
          (e.playAnimation(`animation.xp_furniture.player.sleep_custom_end${t ? '_hammock' : ''}`),
          stopSleepSession(i, e),
          eo());
      } catch {
        stopSleepSession(i, e);
      }
    }, 5);
    registerSleepRun(i, o);
  } else Gi(e, r, t, n);
}
function Gi(e, r, t = !1, n = !1) {
  let a = e.id;
  clearSleepRuns(a);
  sleepSessions.set(a, { runIds: new Set(), inputLocked: !0 });
  try {
    (e.setDynamicProperty(sleepInputLockProperty, !0),
      e.playAnimation(`animation.xp_furniture.player.sleep_custom${t ? '_hammock' : ''}`, {
        stopExpression: '!q.is_riding',
      }),
      e.inputPermissions.setPermissionCategory(gr.Movement, !1),
      e.inputPermissions.setPermissionCategory(gr.Camera, !1),
      e.onScreenDisplay.setActionBar({
        translate: n
          ? 'xp_furniture:multiplayer.playersSkippingThunderstorm'
          : 'multiplayer.playersSkippingNight',
      }),
      e.camera.fade({
        fadeColor: { blue: 0, green: 0, red: 0 },
        fadeTime: { fadeInTime: 4, holdTime: 1, fadeOutTime: 1 },
      }));
  } catch {
    (stopSleepSession(a, e), eo());
    return;
  }
  let o = ge.runTimeout(() => {
      if (!e.isValid) {
        stopSleepSession(a);
        return;
      }
      try {
        e.removeTag('xp_is_sleeping');
        let u = he.getAbsoluteTime() + (25e3 - he.getTimeOfDay());
        (he.setAbsoluteTime(u),
          he.setTimeOfDay(h_.Day),
          e.dimension.setWeather(Mn.Clear, 18e3),
          scheduleInsomniaRestore(),
          r.runCommand('ride @s evict_riders'),
          eo());
      } finally {
        stopSleepSession(a, e);
      }
    }, 5 * Tn),
    i = ge.runInterval(() => {
      if (!e.isValid) {
        stopSleepSession(a);
        return;
      }
      try {
        e.getComponent(w_.componentId) === void 0 && stopSleepSession(a, e);
      } catch {
        stopSleepSession(a, e);
      }
    }, 5);
  (registerSleepRun(a, o, !0), registerSleepRun(a, i, !0));
}
function eo() {
  let e = he.getPlayers(),
    r = e.filter((n) => n.hasTag('xp_is_sleeping') || n.isSleeping).length,
    t = e.length === 0 ? 0 : Math.floor((r / e.length) * 100);
  (he.setDynamicProperty('xp_furniture:sleeping_count', r),
    he.setDynamicProperty('xp_furniture:sleeping_percentage', t));
}
he.afterEvents.weatherChange.subscribe((e) => {
  he.setDynamicProperty('xp_furniture:weather', e.newWeather);
});
var Ni = h.getLogger('FurniturePack', 'Interactive', 'Blinds/Curtains'),
  tt = class {
    onPlayerInteract(r) {
      let { block: t } = r,
        n = this.cardinalToInt(t.permutation.getState('minecraft:cardinal_direction')),
        o = t.permutation.getState('xp_furniture:is_opened'),
        i = t.permutation.getState('xp_furniture:top_piece_bit'),
        a = t.permutation.getState('xp_furniture:multiblock_part'),
        u = [t],
        _ = (s) => {
          u.push(...s);
        };
      if (i !== void 0) _([i === 0 ? t.above() : void 0, i === 1 ? t.below() : void 0]);
      else if (a !== void 0) {
        if (n === void 0) {
          Ni.info(`Invalid direction for block ${t.typeId} at ${t.location}`);
          return;
        }
        let s = [
            [t.east(), t.east()?.above(), t.above()],
            [t.south(), t.south()?.above(), t.above()],
            [t.west(), t.west()?.above(), t.above()],
            [t.north(), t.north()?.above(), t.above()],
            [t.above(), t.above()?.west(), t.west()],
            [t.above(), t.above()?.north(), t.north()],
            [t.above(), t.above()?.east(), t.east()],
            [t.above(), t.above()?.south(), t.south()],
            [t.east(), t.east()?.below(), t.below()],
            [t.south(), t.south()?.below(), t.below()],
            [t.west(), t.west()?.below(), t.below()],
            [t.north(), t.north()?.below(), t.below()],
            [t.below(), t.below()?.west(), t.west()],
            [t.below(), t.below()?.north(), t.north()],
            [t.below(), t.below()?.east(), t.east()],
            [t.below(), t.below()?.south(), t.south()],
          ],
          c = a * 4 + n;
        _(s[c]);
      }
      (u.forEach((s) => {
        s &&
          s.typeId === t.typeId &&
          (Ni.info(`Toggling ${s.typeId} at `, s.location, `isOpened: ${o}`),
          s.setPermutation(s.permutation.withState('xp_furniture:is_opened', o ? 0 : 1)));
      }),
        t.dimension.playSound(
          `xp_furniture:${t.typeId.includes('blind') ? 'blinds' : 'curtains'}.${o ? 'close' : 'open'}`,
          t.location,
        ));
    }
    cardinalToInt(r) {
      if (!(r === void 0 || typeof r != 'string'))
        switch (r) {
          case 'north':
            return 0;
          case 'east':
            return 1;
          case 'south':
            return 2;
          case 'west':
            return 3;
          default:
            return;
        }
    }
  };
((tt.componentId = 'xp_furniture:blinds_curtains'),
  d([m], tt.prototype, 'onPlayerInteract', 1),
  (tt = d([x], tt)));
import { BlockPermutation as y_, EquipmentSlot as P_ } from '@minecraft/server';
var ln = h.getLogger('FurniturePack', 'Interactive', 'Book Pile'),
  nt = class {
    onPlayerInteract(r) {
      let t = r.player,
        n = r.block;
      if (t === void 0) return;
      let o = y.getEquippableComponent(t);
      if (o === void 0) return;
      let i = o.getEquipment(P_.Mainhand);
      if (i === void 0 || i.typeId !== 'xp_furniture:book_pile') return;
      let a = n.permutation.getAllStates(),
        u = a['xp_furniture:book_count'],
        _ = ['up', 'down'].includes(a['minecraft:block_face']);
      if ((ln.info(a), _ && u >= 3)) {
        ln.info('Book pile is full');
        return;
      } else if (!_ && u >= 1) {
        ln.info('Book pile is full');
        return;
      }
      ((a['xp_furniture:book_count'] = u + 1),
        t.runCommand(`clear @s ${i.typeId} 0 1`),
        ln.info(a),
        n.setPermutation(y_.resolve(r.block.typeId, a)),
        r.dimension.playSound('dig.wood', n.location));
    }
  };
((nt.componentId = 'xp_furniture:book_pile'),
  d([m], nt.prototype, 'onPlayerInteract', 1),
  (nt = d([x], nt)));
import { BlockPermutation as E_ } from '@minecraft/server';
var sn = class {
  static onInteract(r) {
    let { block: t, itemStack: n } = r;
    if (
      !n ||
      !n.typeId.includes('axe') ||
      (!t.typeId.includes('carved_pumpkin') && !t.typeId.includes('lit_pumpkin'))
    )
      return;
    let o = {
        'minecraft:carved_pumpkin': 'xp_furniture:carved_pumpkin_0',
        'xp_furniture:carved_pumpkin_0': 'xp_furniture:carved_pumpkin_1',
        'xp_furniture:carved_pumpkin_1': 'xp_furniture:carved_pumpkin_2',
        'xp_furniture:carved_pumpkin_2': 'xp_furniture:carved_pumpkin_3',
        'xp_furniture:carved_pumpkin_3': 'xp_furniture:carved_pumpkin_4',
        'xp_furniture:carved_pumpkin_4': 'xp_furniture:carved_pumpkin_5',
        'xp_furniture:carved_pumpkin_5': 'minecraft:carved_pumpkin',
        'minecraft:lit_pumpkin': 'xp_furniture:lit_pumpkin_0',
        'xp_furniture:lit_pumpkin_0': 'xp_furniture:lit_pumpkin_1',
        'xp_furniture:lit_pumpkin_1': 'xp_furniture:lit_pumpkin_2',
        'xp_furniture:lit_pumpkin_2': 'xp_furniture:lit_pumpkin_3',
        'xp_furniture:lit_pumpkin_3': 'xp_furniture:lit_pumpkin_4',
        'xp_furniture:lit_pumpkin_4': 'xp_furniture:lit_pumpkin_5',
        'xp_furniture:lit_pumpkin_5': 'minecraft:lit_pumpkin',
      },
      i = {
        carved_pumpkin: 'xp_furniture:carved_pumpkin_0',
        lit_pumpkin: 'xp_furniture:lit_pumpkin_0',
      },
      a = o[t.typeId] ?? i[t.typeId.split(':')[1]] ?? t.typeId;
    (console.warn(a),
      t.setPermutation(
        E_.resolve(a, {
          'minecraft:cardinal_direction':
            t.permutation.getState('minecraft:cardinal_direction') ?? 'south',
        }),
      ));
  }
};
d([ri], sn, 'onInteract', 1);
import { EquipmentSlot as D_, ItemStack as Wt, system as ot, world as Hi } from '@minecraft/server';
var ke = class {
  constructor() {
    this.blockId = 'xp_furniture:christmas_tree';
    this.lightBlockState = 'xp_furniture:light';
    this.isLitProperty = 'xp_furniture:is_lit';
    this.candleProperty = 'xp_furniture:candles';
    this.emeraldProperty = 'xp_furniture:emeralds';
    this.redstoneProperty = 'xp_furniture:redstone';
    this.diamondProperty = 'xp_furniture:diamonds';
    this.propertyItem = {
      [this.candleProperty]: 'minecraft:candle',
      [this.emeraldProperty]: 'minecraft:emerald',
      [this.redstoneProperty]: 'minecraft:redstone',
      [this.diamondProperty]: 'minecraft:diamond',
    };
    ot.run(() => {
      (Hi.beforeEvents.playerInteractWithBlock.subscribe(this.playerInteractWithBlock.bind(this)),
        Hi.beforeEvents.entityRemove.subscribe(this.entityBeforeRemove.bind(this)));
    });
  }
  onPlayerInteract(r) {
    let t = r.player;
    if (!t) return;
    let n = y.getEquippableComponent(t);
    if (!n) return;
    let o = n.getEquipment(D_.Mainhand);
    if (o) {
      let i = this.getTreeEntity(r.block);
      if (!i) {
        ke.log.error('No entity found for tree');
        return;
      }
      if (o.typeId === 'minecraft:candle') {
        if (i.getProperty(this.candleProperty)) return;
        (i.setProperty(this.candleProperty, !0), W.decrementStack(t, o.typeId));
      } else if (o.typeId.includes('emerald')) {
        if (i.getProperty(this.emeraldProperty)) return;
        (i.setProperty(this.emeraldProperty, !0), W.decrementStack(t, o.typeId));
      } else if (o.typeId.includes('redstone')) {
        if (i.getProperty(this.redstoneProperty)) return;
        (i.setProperty(this.redstoneProperty, !0),
          ot.waitTicks(1).then(() => {
            this.updateLight(i);
          }),
          W.decrementStack(t, o.typeId));
      } else if (o.typeId.includes('diamond')) {
        if (i.getProperty(this.diamondProperty)) return;
        (i.setProperty(this.diamondProperty, !0), W.decrementStack(t, o.typeId));
      }
    } else this.dropItem(r.block);
  }
  playerInteractWithBlock(r) {
    if (r.block.typeId === this.blockId) {
      let t = r.itemStack;
      if (!t || t.typeId !== 'minecraft:flint_and_steel') return;
      r.cancel = !0;
      let n = this.getTreeEntity(r.block);
      if (!n) return;
      let o = n.getProperty(this.candleProperty),
        i = n.getProperty(this.isLitProperty);
      if (!o || i) return;
      ot.run(() => {
        (n.setProperty(this.isLitProperty, !0),
          ot.waitTicks(1).then(() => {
            this.updateLight(n);
          }));
      });
    }
  }
  entityBeforeRemove(r) {
    let t = r.removedEntity;
    if (t.typeId === this.blockId + '.e') {
      let n = t.getProperty(this.candleProperty),
        o = t.getProperty(this.redstoneProperty),
        i = t.getProperty(this.diamondProperty),
        a = t.getProperty(this.emeraldProperty),
        u = t.dimension,
        _ = f.from(t.location).add(0, 0.7, 0);
      (n || o || i || a) &&
        ot.run(() => {
          (n && u.spawnItem(new Wt('minecraft:candle', 1), _),
            o && u.spawnItem(new Wt('minecraft:redstone', 1), _),
            i && u.spawnItem(new Wt('minecraft:diamond', 1), _),
            a && u.spawnItem(new Wt('minecraft:emerald', 1), _));
        });
    }
  }
  getTreeEntity(r) {
    let t = r.permutation.getState('xp_furniture:is_top_bit') === 1;
    return r.dimension
      .getEntitiesAtBlockLocation(f.from(r.location).add(0, t ? -1 : 0, 0))
      .filter((n) => n.typeId === r.typeId + '.e')[0];
  }
  dropItem(r) {
    let t = this.getTreeEntity(r);
    if (!t) {
      ke.log.error('No entity found for tree');
      return;
    }
    let n = [];
    if (t.getProperty(this.candleProperty)) {
      if (t.getProperty(this.isLitProperty)) {
        t.setProperty(this.isLitProperty, !1);
        return;
      }
      n.push(this.candleProperty);
    }
    if (
      (t.getProperty(this.emeraldProperty) && n.push(this.emeraldProperty),
      t.getProperty(this.redstoneProperty) && n.push(this.redstoneProperty),
      t.getProperty(this.diamondProperty) && n.push(this.diamondProperty),
      n.length === 0)
    )
      return;
    let o = n[Math.floor(Math.random() * n.length)];
    ((o === this.candleProperty || o === this.redstoneProperty) &&
      (o === this.candleProperty && t.setProperty(this.isLitProperty, !1),
      ot.waitTicks(1).then(() => {
        this.updateLight(t);
      })),
      t.setProperty(o, !1),
      t.dimension.spawnItem(new Wt(this.propertyItem[o], 1), f.from(t.location).add(0, 1, 0)));
  }
  updateLight(r) {
    let t = r.getProperty(this.candleProperty),
      n = !1,
      o = !1;
    if (
      (t && (n = r.getProperty(this.isLitProperty)),
      (o = r.getProperty(this.redstoneProperty)),
      t && n)
    ) {
      this.getTreeBlocks(r).forEach((i) => {
        ke.log.info('Setting light to 8');
        let a = i.permutation.getAllStates();
        ((a[this.lightBlockState] = 8), i.setPermutation(Q(i.typeId, a)));
      });
      return;
    } else if (o) {
      this.getTreeBlocks(r).forEach((i) => {
        ke.log.info('Setting light to 3');
        let a = i.permutation.getAllStates();
        ((a[this.lightBlockState] = 3), i.setPermutation(Q(i.typeId, a)));
      });
      return;
    } else
      this.getTreeBlocks(r).forEach((i) => {
        ke.log.info('Setting light to 0');
        let a = i.permutation.getAllStates();
        ((a[this.lightBlockState] = 0), i.setPermutation(Q(i.typeId, a)));
      });
  }
  getTreeBlocks(r) {
    let t = [],
      n = r.dimension.getBlock(f.from(r.location).add(0, 0.5, 0));
    if (n && n.typeId === this.blockId) {
      let i = n.permutation.getState('xp_furniture:is_top_bit') === 1 ? n.below() : n.above();
      i && i.typeId === this.blockId && (t.push(n), t.push(i));
    }
    return t;
  }
};
((ke.componentId = 'xp_furniture:christmas_tree'),
  (ke.log = h.getLogger(ke.componentId)),
  d([m], ke.prototype, 'onPlayerInteract', 1),
  (ke = d([x], ke)));
var Ze = class {
  onPlayerInteract(r) {
    let { block: t } = r,
      n = D.getEntityFromBlock(t, { entityTypeId: Ze.componentId });
    n && n.triggerEvent('xp_furniture:on_interact');
  }
};
((Ze.componentId = 'xp_furniture:globe'),
  d([m], Ze.prototype, 'onPlayerInteract', 1),
  (Ze = d([x], Ze)));
import { TicksPerSecond as B_, system as to, world as $e } from '@minecraft/server';
to.runInterval(() => {
  let e = $e.getDynamicProperty('xp_furniture:gnome');
  if (e && e > 0) {
    let r = y.getAllPlayers();
    for (let t of r) {
      let n = t.dimension,
        o = A_(t.location, 11),
        i = Math.random() * 0.7 + 0.3;
      ($e.setDynamicProperty('xp_furniture:gnome', e - 1),
        n.playSound('xp_furniture:gnome', o, { volume: 1, pitch: i }));
    }
  }
}, 3600 * B_);
to.afterEvents.scriptEventReceive.subscribe(
  (e) => {
    e.id === 'xp_furniture_gnome:surrender' &&
      ($e.setDynamicProperty('xp_furniture:gnome', 0),
      $e.sendMessage({ translate: 'xp_furniture:gnome.surrender' }));
  },
  { namespaces: ['xp_furniture_gnome'] },
);
var Ot = class {
  static gnomePlaceBlock(r) {
    if (r.block.permutation.matches('xp_furniture:gnome')) {
      let n = $e.getDynamicProperty('xp_furniture:gnome');
      (n
        ? $e.setDynamicProperty('xp_furniture:gnome', n + 1)
        : $e.setDynamicProperty('xp_furniture:gnome', 1),
        Qi(r.player.location, r.player));
    }
  }
  static gnomeBreakBlock(r) {
    if (r.brokenBlockPermutation.matches('xp_furniture:gnome')) {
      let n = $e.getDynamicProperty('xp_furniture:gnome');
      (n
        ? $e.setDynamicProperty('xp_furniture:gnome', n - 1)
        : $e.setDynamicProperty('xp_furniture:gnome', 0),
        Qi(r.player.location, r.player));
    }
  }
};
(d([Ge], Ot, 'gnomePlaceBlock', 1), d([_r], Ot, 'gnomeBreakBlock', 1));
function Qi(e, r) {
  let t = Math.floor(Math.random() * 300 + 300);
  to.runTimeout(() => {
    r.runCommand(`playsound xp_furniture:gnome @s ${e.x + ' ' + e.y + ' ' + e.z} 1 0.3 0.2`);
  }, t);
}
function A_(e, r) {
  let t = e.x + Math.random() * r * 2 - r,
    n = e.y + Math.random() * r * 2 - r,
    o = e.z + Math.random() * r * 2 - r;
  return { x: t, y: n, z: o };
}
var Ie = class {
  onPlayerInteract(r) {
    let { block: t } = r,
      n = D.getEntityFromBlock(t, { entityTypeId: Ie.componentId });
    n && n.triggerEvent('xp_furniture:on_interact');
  }
};
((Ie.componentId = 'xp_furniture:instruments'),
  d([m], Ie.prototype, 'onPlayerInteract', 1),
  (Ie = d([x], Ie)));
import { EquipmentSlot as ji, ItemStack as W_ } from '@minecraft/server';
var hr = class {
  constructor() {
    this.log = h.getLogger('MetalPump');
    this.TURN_OFF_TIME_SECONDS = 8;
  }
  onPlayerInteract(r) {
    let { block: t, dimension: n, player: o } = r;
    if (!o) return;
    let i = t.location;
    if (n.id === 'minecraft:nether') {
      (n.playSound('random.fizz', i),
        n.spawnParticle('minecraft:cauldron_explosion_emitter', i),
        this.log.info('Metal Pump cannot be used in the Nether.'));
      return;
    }
    let a = D.getEntityFromBlock(t);
    if (a) {
      if (a.getProperty('xp_furniture:is_interacted_with')) {
        let u = y.getEquippableComponent(o);
        if (!u) return;
        u.getEquipment(ji.Mainhand)?.typeId === 'minecraft:bucket' &&
          (u.setEquipment(ji.Mainhand, new W_('minecraft:water_bucket', 1)),
          n.playSound('bucket.fill_water', i),
          this.log.debug(`Water bucket filled for: ${o.name}`));
      }
      (a.setProperty('xp_furniture:is_interacted_with', !0),
        a.setDynamicProperty('xp_furniture:pump_timer', this.TURN_OFF_TIME_SECONDS));
    }
  }
  onTick(r) {
    let { block: t } = r,
      n = D.getEntityFromBlock(t);
    if (!n) return;
    let o = n.getDynamicProperty('xp_furniture:pump_timer');
    o !== void 0 &&
      (o > 0
        ? ((o -= 1),
          n.setDynamicProperty('xp_furniture:pump_timer', o),
          this.log.debug(`Pump timer: ${o}s`))
        : (n.setProperty('xp_furniture:is_interacted_with', !1),
          n.setDynamicProperty('xp_furniture:pump_timer', void 0),
          this.log.debug('Pump turned off')));
  }
};
((hr.componentId = 'xp_furniture:metal_pump'),
  d([m], hr.prototype, 'onPlayerInteract', 1),
  d([m], hr.prototype, 'onTick', 1),
  (hr = d([x], hr)));
var Te = class {
  constructor() {
    this.log = h.getLogger('MobPlushie');
  }
  onPlayerInteract(r) {
    let { block: t } = r,
      n = D.getEntityFromBlock(t, { entityTypeId: Te.componentId });
    (this.log.debug(t.typeId, n?.typeId), n && n.triggerEvent('xp_furniture:on_interact'));
  }
};
((Te.componentId = 'xp_furniture:mob_plushie'),
  d([m], Te.prototype, 'onPlayerInteract', 1),
  (Te = d([x], Te)));
import { EntityRideableComponent as O_ } from '@minecraft/server';
var it = class {
  onPlayerInteract(r) {
    let t = r.dimension
      .getEntitiesAtBlockLocation(r.block.location)
      .filter((o) => o.typeId === 'xp_furniture:seat')[0];
    if (!t) return;
    let n = t.getComponent(O_.componentId);
    n !== void 0 && n.ejectRiders();
  }
};
((it.componentId = 'xp_furniture:pet_bed'),
  d([m], it.prototype, 'onPlayerInteract', 1),
  (it = d([x], it)));
import {
  Direction as ve,
  ItemStack as L_,
  MolangVariableMap as q_,
  system as dn,
  TicksPerSecond as Vi,
} from '@minecraft/server';
var z_ = h.getLogger('FurniturePack', 'Interactive', 'Piano'),
  Wr = class {
    constructor() {
      this.transformDirection = (r, t) => {
        switch (t) {
          case 1:
            return f.from({ x: 1 - r.z, y: r.y, z: r.x });
          case 2:
            return f.from({ x: 1 - r.x, y: r.y, z: 1 - r.z });
          case 3:
            return f.from({ x: r.z, y: r.y, z: 1 - r.x });
          default:
            return f.from(r);
        }
      };
    }
    onPlace(r) {
      let { block: t } = r;
      if (this.getSide(t) === 'left') {
        let n = q.summonAuxiliaryEntity(r.block, 'xp_furniture:piano_keys');
        (n.triggerEvent(`xp_furniture:set_init_rotation.${no(t).toLowerCase()}`),
          t.typeId.endsWith('_fancy') && n.triggerEvent('xp_furniture:set_fancy'));
      }
    }
    onPlayerInteract(r) {
      let { block: t, face: n, player: o } = r,
        i = t.dimension,
        a = this.translateByPosition(t.location, r.faceLocation),
        u = this.getSide(t),
        _;
      {
        let A;
        if (
          (u === 'left'
            ? (A = t.location)
            : (A = {
                [ve.North]: t.west()?.location,
                [ve.East]: t.south()?.location,
                [ve.South]: t.east()?.location,
                [ve.West]: t.north()?.location,
              }[no(t)]),
          !A)
        )
          return;
        let $ = i.getEntities({ location: A, maxDistance: 2, type: 'xp_furniture:piano_keys' });
        if ($.length < 1) return;
        _ = $[0];
      }
      if (n !== ve.Up || !a) return;
      let s = f.from(a),
        c = {
          x: Math.round(s.x * 100) / 100,
          y: Math.round((1 - s.y) * 100) / 100,
          z: Math.round(s.z * 100) / 100,
        },
        p = (A, $, N) =>
          A.x >= Math.min($.x, N.x) &&
          A.x <= Math.max($.x, N.x) &&
          A.y >= Math.min($.y, N.y) &&
          A.y <= Math.max($.y, N.y) &&
          A.z >= Math.min($.z, N.z) &&
          A.z <= Math.max($.z, N.z),
        w = this.getRemappedKeys(R_(no(t))),
        C = (() => {
          let A = w[u];
          for (let $ of A)
            if (Array.isArray($)) {
              for (let N of $) if (p(c, N.from, N.to)) return N.keyValue;
            } else if (p(c, $.from, $.to)) return $.keyValue;
        })();
      if (C === void 0) {
        z_.info(`No key pressed at ${JSON.stringify(c)}`);
        return;
      }
      let P = `xp_furniture:key${C}`;
      (_.setProperty(P, !0), dn.runTimeout(() => _.resetProperty(P), 2));
      let O = (A) => {
          let $ = A / 12,
            N = $,
            K = 1 - $,
            Se = 0.5 * (1 - Math.abs(0.5 - $) * 2);
          return { red: N, green: K, blue: Se, alpha: 1 };
        },
        F = new q_();
      if (
        (F.setColorRGBA('variable.note_color', O(12 - C)),
        i.playSound(`xp_furniture:piano.${C}`, t.location),
        i.spawnParticle(
          'minecraft:note_particle',
          f.from(t.location).add(this.translateParticleByPosition(t.location, r.faceLocation)),
          F,
        ),
        !o)
      )
        return;
      o.getDynamicProperty('xp_furniture:happy_birthday') === void 0 &&
        o.setDynamicProperty('xp_furniture:happy_birthday', '0,0,2,0,5,4');
      let B = o
        .getDynamicProperty('xp_furniture:happy_birthday')
        .split(',')
        .filter((A) => A !== ',')
        .map((A) => parseInt(A));
      if (B[0] === C) {
        if ((B.shift(), B.length > 0))
          o.setDynamicProperty('xp_furniture:happy_birthday', B.join(','));
        else if (B.length === 0) {
          let A = dn.runInterval(
            () => {
              (i.spawnEntity(
                'minecraft:fireworks_rocket',
                f
                  .from(o.location)
                  .add({ x: Math.random() * 0.5 - 0.25, y: 1.5, z: Math.random() * 0.5 - 0.25 }),
              ),
                i.spawnItem(
                  new L_('minecraft:cake'),
                  f
                    .from(t.location)
                    .add({ x: Math.withinRange(-5, 5), y: 1.5, z: Math.withinRange(-5, 5) }),
                ));
            },
            Math.withinRange(0.334, 0.667) * Vi,
          );
          (dn.runTimeout(() => {
            dn.clearRun(A);
          }, 5 * Vi),
            o.setDynamicProperty('xp_furniture:happy_birthday', 'done'));
        }
      } else
        o.getDynamicProperty('xp_furniture:happy_birthday') !== 'done' &&
          o.setDynamicProperty('xp_furniture:happy_birthday', void 0);
    }
    getRemappedKeys(r) {
      let t = {
        left: [
          [
            { from: { x: 0.75, y: 0.69, z: 0 }, to: { x: 0.57, y: 0.75, z: 0.13 }, keyValue: 0 },
            { from: { x: 0.75, y: 0.69, z: 0 }, to: { x: 0.63, y: 0.75, z: 0.37 }, keyValue: 0 },
          ],
          { from: { x: 0.64, y: 0.69, z: 0.14 }, to: { x: 0.5, y: 0.75, z: 0.37 }, keyValue: 1 },
          [
            { from: { x: 0.56, y: 0.69, z: 0 }, to: { x: 0.38, y: 0.75, z: 0.13 }, keyValue: 2 },
            { from: { x: 0.51, y: 0.69, z: 0 }, to: { x: 0.44, y: 0.75, z: 0.37 }, keyValue: 2 },
          ],
          { from: { x: 0.45, y: 0.69, z: 0.14 }, to: { x: 0.31, y: 0.75, z: 0.37 }, keyValue: 3 },
          [
            { from: { x: 0.39, y: 0.69, z: 0 }, to: { x: 0.19, y: 0.75, z: 0.13 }, keyValue: 4 },
            { from: { x: 0.32, y: 0.69, z: 0 }, to: { x: 0.19, y: 0.75, z: 0.37 }, keyValue: 4 },
          ],
          [
            { from: { x: 0.2, y: 0.69, z: 0 }, to: { x: 0, y: 0.75, z: 0.13 }, keyValue: 5 },
            { from: { x: 0.2, y: 0.69, z: 0 }, to: { x: 0.07, y: 0.75, z: 0.37 }, keyValue: 5 },
          ],
          { from: { x: 0.06, y: 0.69, z: 0.14 }, to: { x: 0, y: 0.75, z: 0.37 }, keyValue: 6 },
        ],
        right: [
          { from: { x: 1, y: 0.69, z: 0.14 }, to: { x: 0.94, y: 0.75, z: 0.37 }, keyValue: 6 },
          [
            { from: { x: 1, y: 0.69, z: 0 }, to: { x: 0.82, y: 0.75, z: 0.13 }, keyValue: 7 },
            { from: { x: 0.95, y: 0.69, z: 0 }, to: { x: 0.86, y: 0.75, z: 0.37 }, keyValue: 7 },
          ],
          { from: { x: 0.87, y: 0.69, z: 0.14 }, to: { x: 0.74, y: 0.75, z: 0.37 }, keyValue: 8 },
          [
            { from: { x: 0.81, y: 0.69, z: 0 }, to: { x: 0.62, y: 0.75, z: 0.13 }, keyValue: 9 },
            { from: { x: 0.75, y: 0.69, z: 0 }, to: { x: 0.69, y: 0.75, z: 0.37 }, keyValue: 9 },
          ],
          { from: { x: 0.7, y: 0.69, z: 0.14 }, to: { x: 0.55, y: 0.75, z: 0.37 }, keyValue: 10 },
          [
            { from: { x: 0.63, y: 0.69, z: 0 }, to: { x: 0.43, y: 0.75, z: 0.13 }, keyValue: 11 },
            { from: { x: 0.56, y: 0.69, z: 0 }, to: { x: 0.43, y: 0.75, z: 0.37 }, keyValue: 11 },
          ],
          { from: { x: 0.44, y: 0.69, z: 0 }, to: { x: 0.25, y: 0.75, z: 0.37 }, keyValue: 12 },
        ],
      };
      if (r === 0) return t;
      let n = {};
      for (let o in t)
        n[o] = t[o].map((i) =>
          Array.isArray(i)
            ? i.map((a) => ({
                ...a,
                from: this.transformDirection(a.from, r),
                to: this.transformDirection(a.to, r),
              }))
            : {
                ...i,
                from: this.transformDirection(i.from, r),
                to: this.transformDirection(i.to, r),
              },
        );
      return n;
    }
    getSide(r) {
      return r.permutation.getState('xp_furniture:width_piece') === 0 ? 'left' : 'right';
    }
    translateParticleByPosition(r, t) {
      return t ? { x: r.x >= 0 ? t.x : 1 - t.x, y: 1, z: r.z >= 0 ? t.z : 1 - t.z } : r;
    }
    translateByPosition(r, t) {
      return t
        ? { x: r.x >= 0 ? 1 - t.x : t.x, y: r.y >= 0 ? 1 - t.y : t.y, z: r.z >= 0 ? 1 - t.z : t.z }
        : r;
    }
  };
((Wr.componentId = 'xp_furniture:piano'),
  d([m], Wr.prototype, 'onPlace', 1),
  d([m], Wr.prototype, 'onPlayerInteract', 1),
  (Wr = d([x], Wr)));
function no(e) {
  let r = e.permutation.getState('xp_furniture:direction');
  switch (
    (r === void 0 &&
      (e.permutation.getState('minecraft:cardinal_direction'),
      (r = e.permutation.getState('minecraft:cardinal_direction'))),
    r)
  ) {
    case 2:
    case 'north':
      return ve.North;
    case 1:
    case 'west':
      return ve.East;
    case 0:
    case 'south':
      return ve.South;
    case 3:
    case 'east':
      return ve.West;
    default:
      return ve.North;
  }
}
function R_(e) {
  switch (e) {
    case ve.South:
      return 2;
    case ve.East:
      return 3;
    case ve.North:
      return 0;
    case ve.West:
      return 1;
    default:
      return 2;
  }
}
import {
  BlockPermutation as Ui,
  EquipmentSlot as oo,
  GameMode as F_,
  ItemStack as G_,
} from '@minecraft/server';
var Ne = class {
  constructor() {
    this.log = h.getLogger('PictureFrame');
  }
  onPlayerInteract(r, t) {
    let { block: n, dimension: o, player: i } = r;
    if (!i) return;
    let a = this.validate(t.params);
    if (!a) return;
    let u = n.center(),
      _ = n.permutation.getAllStates();
    a.picture === 'empty'
      ? this.placePictureOnFrame(i, o, u, _, a.type)
      : this.removePictureFromFrame(n, o, u, _, a);
  }
  placePictureOnFrame(r, t, n, o, i) {
    let a = y.getEquippableComponent(r);
    if (!a) return;
    let u = a?.getEquipment(oo.Mainhand);
    if (!u) return;
    let _ = this.parseType(u.typeId);
    if (!_) return;
    r.getGameMode() !== F_.Creative &&
      (u.amount > 1
        ? ((u.amount -= 1), a.setEquipment(oo.Mainhand, u))
        : a.setEquipment(oo.Mainhand, void 0));
    let s = Ui.resolve(`xp_furniture:${i}_picture_frame_${_}`, o);
    (t.setBlockPermutation(n, s),
      t.playSound('sign.dye.use', n, { volume: 1.5, pitch: 1.25 }),
      this.log.info(`Placed: ${_}, on frame: ${i}`));
  }
  removePictureFromFrame(r, t, n, o, i) {
    let a = i.picture || this.parseType(r.typeId);
    if (!a) return;
    (t.spawnItem(new G_(`xp_furniture:${a}_polaroid`, 1), n), t.playSound('random.pop', n));
    let u = Ui.resolve(`xp_furniture:${i.type}_picture_frame`, o);
    (t.setBlockPermutation(n, u), this.log.info(`Took: ${a}, from frame: ${i.type}`));
  }
  parseType(r) {
    if (!r.startsWith('xp_furniture:')) return null;
    let t = r.split(':')[1];
    return t.endsWith('_polaroid')
      ? t.replace('_polaroid', '')
      : t.startsWith('wooden_picture_frame_')
        ? t.replace('wooden_picture_frame_', '')
        : null;
  }
  validate(r) {
    if (typeof r != 'object' || r === null) {
      this.log.error('PictureFrameArgs has no arguments. Expected an object.');
      return;
    }
    for (let [t, n] of Object.entries(Ne.schema)) {
      let o = r[t];
      if (!(t in r)) {
        if (n.required) {
          this.log.error(`PictureFrameArgs component is missing required argument: "${t}"`);
          return;
        }
        continue;
      }
      if (typeof o !== n.type) {
        this.log.error(
          `PictureFrameArgs | "${t}" has an invalid type. Expected ${n.type}, got ${typeof o}`,
        );
        return;
      }
    }
    return r;
  }
};
((Ne.componentId = 'xp_furniture:picture_frame'),
  (Ne.schema = {
    type: { type: 'string', required: !0 },
    picture: { type: 'string', required: !0 },
  }),
  d([m], Ne.prototype, 'onPlayerInteract', 1),
  (Ne = d([x], Ne)));
import { BlockPermutation as Ji } from '@minecraft/server';
var $_ = h.getLogger('FurniturePack', 'Interactive', 'Pie'),
  at = class {
    onPlayerInteract(r) {
      let t = r.block.permutation.getAllStates(),
        n = t['xp_furniture:slices'];
      if (n === void 0) {
        $_.debug('Missing `xp_furniture:slices` state');
        return;
      }
      r.player !== void 0 &&
        (r.player.runCommand('give @s xp_furniture:pumpkin_pie_slice 1'),
        n === 1
          ? r.block.setPermutation(Ji.resolve('minecraft:air'))
          : ((t['xp_furniture:slices'] = n - 1),
            r.block.setPermutation(Ji.resolve(r.block.typeId, t))));
    }
  };
((at.componentId = 'xp_furniture:pie'),
  d([m], at.prototype, 'onPlayerInteract', 1),
  (at = d([x], at)));
import {
  Block as H_,
  BlockPermutation as ao,
  EquipmentSlot as Q_,
  ItemStack as Lt,
  Player as j_,
} from '@minecraft/server';
var Xi = [
  {
    visuals: [{ geo: 'plant_cross', texture: 'xp_furniture:blazing_star' }],
    item: 'xp_furniture:blazing_star_item',
  },
  {
    visuals: [{ geo: 'plant_cross', texture: 'xp_furniture:butterflower_cluster' }],
    item: 'xp_furniture:butterflower_cluster_item',
  },
  {
    visuals: [{ geo: 'plant_cross', texture: 'xp_furniture:butterfly_milkweed' }],
    item: 'xp_furniture:butterfly_milkweed_item',
  },
  {
    visuals: [{ geo: 'plant_fern', texture: 'xp_furniture:fern' }],
    item: 'xp_furniture:sword_fern_item',
  },
  { visuals: [{ geo: 'plant_bush', texture: 'xp_furniture:bush' }], item: 'xp_furniture:bush' },
  {
    visuals: [{ geo: 'plant_small_cactus_0', texture: 'xp_furniture:small_cactus_0' }],
    item: 'xp_furniture:small_cactus_0',
  },
  {
    visuals: [{ geo: 'plant_small_cactus_1', texture: 'xp_furniture:small_cactus_1' }],
    item: 'xp_furniture:small_cactus_1',
  },
  {
    visuals: [{ geo: 'plant_small_cactus_2', texture: 'xp_furniture:small_cactus_2' }],
    item: 'xp_furniture:small_cactus_2',
  },
  {
    visuals: [{ geo: 'plant_flower_cluster', texture: 'xp_furniture:flower_cluster_0' }],
    item: 'xp_furniture:flower_cluster_0_item',
  },
  {
    visuals: [{ geo: 'plant_flower_cluster', texture: 'xp_furniture:flower_cluster_1' }],
    item: 'xp_furniture:flower_cluster_1_item',
  },
  {
    visuals: [{ geo: 'plant_flower_cluster', texture: 'xp_furniture:flower_cluster_2' }],
    item: 'xp_furniture:flower_cluster_2_item',
  },
  {
    visuals: [{ geo: 'plant_flower_cluster', texture: 'xp_furniture:flower_cluster_3' }],
    item: 'xp_furniture:flower_cluster_3_item',
  },
  {
    visuals: [{ geo: 'plant_leafy_0', texture: 'xp_furniture:leafy_plant_0' }],
    item: 'xp_furniture:philodendron_item',
  },
  {
    visuals: [{ geo: 'plant_leafy_1', texture: 'xp_furniture:leafy_plant_1' }],
    item: 'xp_furniture:maidenhair_fern_item',
  },
  {
    visuals: [{ geo: 'plant_monstera', texture: 'xp_furniture:plant_monstera' }],
    item: 'xp_furniture:monstera_item',
  },
  {
    visuals: [{ geo: 'plant_succulent', texture: 'xp_furniture:succulent' }],
    item: 'xp_furniture:succulent_item',
  },
  {
    visuals: [{ geo: 'plant_cross', texture: 'xp_furniture:cherry_sapling' }],
    item: 'minecraft:cherry_sapling',
  },
  { visuals: [{ geo: 'plant_cross', texture: 'yellow_flower' }], item: 'minecraft:dandelion' },
  { visuals: [{ geo: 'plant_cross', texture: 'wither_rose' }], item: 'minecraft:wither_rose' },
  {
    visuals: [{ geo: 'plant_cross', texture: 'xp_furniture:torchflower' }],
    item: 'minecraft:torchflower',
  },
  {
    visuals: [{ geo: 'plant_cross', texture: 'xp_furniture:pitcher_plant' }],
    item: 'minecraft:pitcher_plant',
  },
  { visuals: [{ geo: 'plant_cross', texture: 'xp_furniture:poppy' }], item: 'minecraft:poppy' },
  {
    visuals: [{ geo: 'plant_cross', texture: 'xp_furniture:blue_orchid' }],
    item: 'minecraft:blue_orchid',
  },
  { visuals: [{ geo: 'plant_cross', texture: 'xp_furniture:allium' }], item: 'minecraft:allium' },
  {
    visuals: [{ geo: 'plant_cross', texture: 'xp_furniture:azure_bluet' }],
    item: 'minecraft:azure_bluet',
  },
  {
    visuals: [{ geo: 'plant_cross', texture: 'xp_furniture:red_tulip' }],
    item: 'minecraft:red_tulip',
  },
  {
    visuals: [{ geo: 'plant_cross', texture: 'xp_furniture:orange_tulip' }],
    item: 'minecraft:orange_tulip',
  },
  {
    visuals: [{ geo: 'plant_cross', texture: 'xp_furniture:white_tulip' }],
    item: 'minecraft:white_tulip',
  },
  {
    visuals: [{ geo: 'plant_cross', texture: 'xp_furniture:pink_tulip' }],
    item: 'minecraft:pink_tulip',
  },
  {
    visuals: [{ geo: 'plant_cross', texture: 'xp_furniture:oxeye_daisy' }],
    item: 'minecraft:oxeye_daisy',
  },
  {
    visuals: [{ geo: 'plant_cross', texture: 'xp_furniture:cornflower' }],
    item: 'minecraft:cornflower',
  },
  {
    visuals: [{ geo: 'plant_cross', texture: 'xp_furniture:lily_of_the_valley' }],
    item: 'minecraft:lily_of_the_valley',
  },
  {
    visuals: [{ geo: 'plant_sunflower', texture: 'xp_furniture:pot_sunflower' }],
    item: 'minecraft:sunflower',
  },
  {
    visuals: [{ geo: 'plant_overgrown_cross', texture: 'xp_furniture:pot_lilac' }],
    item: 'minecraft:lilac',
  },
  {
    visuals: [{ geo: 'plant_overgrown_cross', texture: 'xp_furniture:pot_vine' }],
    item: 'minecraft:short_grass',
  },
  {
    visuals: [{ geo: 'plant_cross', texture: 'xp_furniture:big_spiky_plant' }],
    item: 'xp_furniture:spike_weeds_item',
  },
  {
    visuals: [{ geo: 'plant_overgrown_cross', texture: 'xp_furniture:pot_rose_bush' }],
    item: 'minecraft:rose_bush',
  },
  {
    visuals: [{ geo: 'plant_overgrown_cross', texture: 'xp_furniture:pot_peony' }],
    item: 'minecraft:peony',
  },
  {
    visuals: [{ geo: 'plant_cross', texture: 'xp_furniture:oak_sapling' }],
    item: 'minecraft:oak_sapling',
  },
  {
    visuals: [{ geo: 'plant_cross', texture: 'xp_furniture:spruce_sapling' }],
    item: 'minecraft:spruce_sapling',
  },
  {
    visuals: [{ geo: 'plant_cross', texture: 'xp_furniture:birch_sapling' }],
    item: 'minecraft:birch_sapling',
  },
  {
    visuals: [{ geo: 'plant_cross', texture: 'xp_furniture:jungle_sapling' }],
    item: 'minecraft:jungle_sapling',
  },
  {
    visuals: [{ geo: 'plant_cross', texture: 'xp_furniture:acacia_sapling' }],
    item: 'minecraft:acacia_sapling',
  },
  {
    visuals: [{ geo: 'plant_cross', texture: 'xp_furniture:dark_oak_sapling' }],
    item: 'minecraft:dark_oak_sapling',
  },
  {
    visuals: [{ geo: 'plant_cross', texture: 'closed_eyeblossom' }],
    item: 'minecraft:closed_eyeblossom',
  },
  {
    visuals: [{ geo: 'plant_cross', texture: 'open_eyeblossom_carried' }],
    item: 'minecraft:open_eyeblossom',
  },
  {
    visuals: [{ geo: 'plant_cross', texture: 'pale_oak_sapling' }],
    item: 'minecraft:pale_oak_sapling',
  },
  {
    visuals: [{ geo: 'plant_cross', texture: 'xp_furniture:dogwood_sapling' }],
    item: 'xp_furniture:dogwood_sapling',
  },
  {
    visuals: [{ geo: 'plant_cross', texture: 'xp_furniture:yellow_birch_sapling' }],
    item: 'xp_furniture:yellow_birch_sapling',
  },
  {
    visuals: [{ geo: 'plant_cross', texture: 'xp_furniture:orange_acacia_sapling' }],
    item: 'xp_furniture:orange_acacia_sapling',
  },
  {
    visuals: [{ geo: 'plant_cross', texture: 'xp_furniture:golden_chain_sapling' }],
    item: 'xp_furniture:golden_chain_sapling',
  },
  {
    visuals: [{ geo: 'plant_cross', texture: 'xp_furniture:wisteria_sapling' }],
    item: 'xp_furniture:wisteria_sapling',
  },
  {
    visuals: [{ geo: 'plant_cross', texture: 'xp_furniture:willow_sapling' }],
    item: 'xp_furniture:willow_sapling',
  },
  {
    visuals: [{ geo: 'plant_cross', texture: 'short_dry_grass' }],
    item: 'minecraft:short_dry_grass',
  },
  {
    visuals: [{ geo: 'plant_cross', texture: 'tall_dry_grass' }],
    item: 'minecraft:tall_dry_grass',
  },
  { visuals: [{ geo: 'plant_cross', texture: 'bush_carried' }], item: 'minecraft:bush' },
  { visuals: [{ geo: 'plant_cross', texture: 'cactus_flower' }], item: 'minecraft:cactus_flower' },
  { visuals: [{ geo: 'plant_cross', texture: 'firefly_bush' }], item: 'minecraft:firefly_bush' },
  {
    visuals: [
      { geo: 'plant_double_cross_bottom', texture: 'xp_furniture:cattail_bottom' },
      { geo: 'plant_double_cross_top', texture: 'xp_furniture:cattail_top' },
    ],
    item: 'xp_furniture:cattail',
  },
  {
    visuals: [
      { geo: 'plant_double_cross_bottom', texture: 'xp_furniture:tall_fern_bottom' },
      { geo: 'plant_double_cross_top', texture: 'xp_furniture:tall_fern_top' },
    ],
    item: 'minecraft:large_fern',
  },
  {
    visuals: [
      { geo: 'plant_double_cross_bottom', texture: 'xp_furniture:foxglove_bottom' },
      { geo: 'plant_double_cross_top', texture: 'xp_furniture:foxglove_top' },
    ],
    item: 'xp_furniture:foxglove',
  },
  {
    visuals: [
      { geo: 'flowerbed_top', texture: 'xp_furniture:pink_petals' },
      { geo: 'flowerbed_stem', texture: 'xp_furniture:flowerbed_stem' },
    ],
    item: 'minecraft:pink_petals',
  },
  {
    visuals: [
      { geo: 'flowerbed_top', texture: 'xp_furniture:wildflowers' },
      { geo: 'flowerbed_stem', texture: 'xp_furniture:flowerbed_stem' },
    ],
    item: 'minecraft:wildflowers',
  },
];
var V_ = Xi,
  io = V_.map((e) => e.item),
  Yi = [
    'xp_furniture:big_flower_pot_hanging_dotted',
    'xp_furniture:big_flower_pot_hanging_lined',
    'xp_furniture:big_flower_pot_hanging_plain',
    'xp_furniture:big_flower_pot_hanging_weaved',
    'xp_furniture:big_flower_pot_hanging_wooden',
    'xp_furniture:big_flower_pot_hanging_dark_green',
    'xp_furniture:big_flower_pot_hanging_decorated',
  ];
var I = h.getLogger('FurniturePack', 'Interactive', 'Planter'),
  Or = class {
    onPlayerInteract(r, t) {
      if (!U_(r.block)) {
        I.debug('Cannot plant');
        return;
      }
      let n = r.player;
      if (!n) return;
      let { dimension: o } = n;
      if (n === void 0 || !(n instanceof j_)) {
        I.debug('No player');
        return;
      }
      if (J_(r.block)) {
        I.debug('Retrieving flower');
        let i = qt(r.block);
        if (i === void 0) return;
        (K_(r.block), o.spawnItem(new Lt(i), n.getHeadLocation()));
      } else {
        I.debug('Planting flower');
        let i = X_(n, r.block);
        i.success && Y_(n, i.itemStack);
      }
    }
    onBreak(r, t) {
      switch (r.brokenBlockPermutation.type.id) {
        case 'xp_furniture:brick_planter_box':
        case 'xp_furniture:clay_planter_box':
        case 'xp_furniture:fancy_clay_planter_box':
        case 'xp_furniture:oak_planter_box':
        case 'xp_furniture:spruce_planter_box':
        case 'xp_furniture:stone_planter_box':
          Z_(r.block, r.brokenBlockPermutation);
          break;
        case 'xp_furniture:big_flower_pot_hanging_dark_green':
        case 'xp_furniture:big_flower_pot_hanging_decorated':
        case 'xp_furniture:big_flower_pot_hanging_dotted':
        case 'xp_furniture:big_flower_pot_hanging_lined':
        case 'xp_furniture:big_flower_pot_hanging_plain':
        case 'xp_furniture:big_flower_pot_hanging_weaved':
        case 'xp_furniture:big_flower_pot_hanging_wooden':
          I_(r.block, r.brokenBlockPermutation);
          break;
        default:
          T_(r.block, r.brokenBlockPermutation);
          break;
      }
    }
  };
((Or.componentId = 'xp_furniture:planter'),
  d([m], Or.prototype, 'onPlayerInteract', 1),
  d([m], Or.prototype, 'onBreak', 1),
  (Or = d([x], Or)));
function U_(e) {
  let r = e.above();
  return !(r !== void 0 && !r.isAir && r.typeId !== e.typeId);
}
function J_(e) {
  let r = e.permutation.getAllStates();
  return r['xp_furniture:flower0'] === 0 && r['xp_furniture:flower1'] === 0
    ? (I.debug('No flower'), !1)
    : (I.debug('Has flower'), !0);
}
function qt(e) {
  let r;
  e instanceof H_ ? (r = e.permutation.getAllStates()) : (r = e.getAllStates());
  let t = r['xp_furniture:flower0'],
    n = r['xp_furniture:flower1'];
  if ((I.debug(`Flower0: ${t}, Flower1: ${n}`), t === 0 && n === 0)) {
    I.debug('No flower id');
    return;
  }
  return (I.debug('Flower id', io[t + (n << 4) - 1]), io[t + (n << 4) - 1]);
}
function X_(e, r) {
  let n = y.getEquippableComponent(e).getEquipment(Q_.Mainhand);
  if (n === void 0) return (I.debug('No item'), { success: !1 });
  let o = io.indexOf(n.typeId) + 1;
  if (o === 0) return (I.debug('Item not plantable', n.typeId), { success: !1 });
  I.info('Planting', o);
  let i = r.permutation.getAllStates();
  return (
    (i['xp_furniture:flower0'] = o & 15),
    (i['xp_furniture:flower1'] = (o >> 4) & 15),
    I.info(i),
    r.setPermutation(ao.resolve(r.typeId, i)),
    { success: !0, itemStack: n }
  );
}
function Y_(e, r) {
  e.runCommand(`clear @s ${r.typeId} 0 1`);
}
function K_(e) {
  let r = e.permutation.getAllStates();
  ((r['xp_furniture:flower0'] = 0),
    (r['xp_furniture:flower1'] = 0),
    e.setPermutation(ao.resolve(e.typeId, r)));
}
function Z_(e, r) {
  let t,
    n = r.getAllStates(),
    o = n['minecraft:cardinal_direction'];
  switch (o) {
    case 'north':
      n['xp_furniture:width_piece'] === 0
        ? (t = e.east())
        : ((t = e.west()), I.info('Adjacent block is east', t?.typeId));
      break;
    case 'south':
      n['xp_furniture:width_piece'] === 0
        ? ((t = e.west()), I.info('Adjacent block is south', t?.typeId))
        : ((t = e.east()), I.info('Adjacent block is west', t?.typeId));
      break;
    case 'west':
      n['xp_furniture:width_piece'] === 0
        ? (t = e.north())
        : ((t = e.south()), I.info('Adjacent block is north', t?.typeId));
      break;
    case 'east':
      n['xp_furniture:width_piece'] === 0
        ? ((t = e.south()), I.info('Adjacent block is east', t?.typeId))
        : ((t = e.north()), I.info('Adjacent block is south', t?.typeId));
      break;
    default:
      I.error('Unknown direction', o);
      break;
  }
  if (t === void 0) return;
  let i = qt(r),
    a = qt(t);
  (i !== void 0 && e.dimension.spawnItem(new Lt(i), f.from(e.center()).add(0, 0.5, 0)),
    a !== void 0 && t.dimension.spawnItem(new Lt(a), f.from(t.center()).add(0, 0.5, 0)),
    t.setPermutation(ao.resolve('minecraft:air')));
}
function I_(e, r) {
  let t = qt(r);
  t !== void 0 && e.dimension.spawnItem(new Lt(t), f.from(e.center()).add(0, 0.5, 0));
}
function T_(e, r) {
  let t = qt(r);
  t !== void 0 && e.dimension.spawnItem(new Lt(t), f.from(e.center()).add(0, 0.5, 0));
}
import { BlockPermutation as M_, system as Ki } from '@minecraft/server';
var Pe = class {
  onPlace(r) {
    let { block: t } = r,
      n = t.permutation.getAllStates(),
      o = ['east', 'north', 'south', 'west'];
    switch (n['minecraft:cardinal_direction']) {
      case 'east':
      case 'west':
        o = ['north', 'south'];
        break;
      case 'north':
      case 'south':
        o = ['west', 'east'];
        break;
    }
    o.forEach((i, a) => {
      let u = t[i]();
      !u ||
        u.type.id != Pe.ropeId ||
        Ki.run(() => this.updateConnection(u, o[a * -1 + o.length - 1], Pe.ropeId, !0));
    });
  }
  onPlayerBreak(r) {
    let { block: t, brokenBlockPermutation: n } = r,
      o = n.getAllStates(),
      i = ['east', 'north', 'south', 'west'];
    switch (o['minecraft:cardinal_direction']) {
      case 'east':
      case 'west':
        i = ['north', 'south'];
        break;
      case 'north':
      case 'south':
        i = ['west', 'east'];
        break;
    }
    i.forEach((a, u) => {
      let _ = t.above(),
        s = t[a]();
      (_ && n.getState('xp_furniture:is_top_bit') == 0 && (s = _[a]()),
        !(!s || s.type.id != Pe.ropeId) &&
          Ki.run(() => this.updateConnection(s, i[u * -1 + i.length - 1], Pe.ropeId, !1)));
    });
  }
  updateConnection(r, t, n, o) {
    let i = r.permutation.getAllStates();
    i[`xp_furniture:${t}`] = o;
    let a = M_.resolve(n, i);
    return r.setPermutation(a);
  }
};
((Pe.componentId = 'xp_furniture:rope_flag'),
  (Pe.ropeId = 'xp_furniture:rope'),
  d([m], Pe.prototype, 'onPlace', 1),
  d([m], Pe.prototype, 'onPlayerBreak', 1),
  (Pe = d([x], Pe)));
import { BlockPermutation as el, Direction as ut, system as rl } from '@minecraft/server';
var Bx = h.getLogger('RopePlacement'),
  tl = {
    [ut.North]: 'north',
    [ut.South]: 'south',
    [ut.East]: 'east',
    [ut.West]: 'west',
    [ut.Up]: 'above',
    [ut.Down]: 'below',
  },
  We = class {
    beforeOnPlayerPlace(r) {
      let { block: t, player: n, face: o, dimension: i } = r;
      if (!n || !n.isSneaking) return;
      let a = t[tl[Fe.Opposites[o]]]();
      if (!a || !a.matches(We.blockId)) return;
      let u = a.above();
      if (!u) return;
      let _ = W.getHeldItem(n);
      if (!_) return;
      r.cancel = !0;
      let s = Zi({ currentBlock: a, previousBlock: u });
      if (s) {
        let { currentBlock: c, previousBlock: p } = s;
        rl.run(() => {
          let w = c.below();
          (c.setPermutation(
            el.resolve(We.blockId, {
              'xp_furniture:up': !0,
              'xp_furniture:down': (w && Yi.includes(w.typeId)) === !0,
            }),
          ),
            p.setPermutation(p.permutation.withState('xp_furniture:down', !0)),
            W.decrementStack(n, _),
            i.playSound('place.azalea', c.location));
        });
      }
    }
  };
((We.componentId = 'xp_furniture:rope_placement'),
  (We.blockId = 'xp_furniture:rope'),
  d([m], We.prototype, 'beforeOnPlayerPlace', 1),
  (We = d([x], We)));
function Zi(e) {
  let r = e.currentBlock.below(),
    t = e.currentBlock;
  if (!r) return;
  let n = { currentBlock: r, previousBlock: t };
  return r.matches(We.blockId) ? Zi(n) : r.isAir ? n : void 0;
}
import { EquipmentSlot as nl, ItemStack as uo } from '@minecraft/server';
var Lr = class {
  beforeOnPlayerPlace(r, t) {
    r.permutationToPlace = r.permutationToPlace.withState('xp_furniture:is_placed', 1);
  }
  onPlayerInteract(r, t) {
    let { block: n, dimension: o, player: i } = r;
    if (!i) return;
    let a = n.permutation,
      u = a.getAllStates(),
      _ = u['xp_furniture:has_water'];
    if (_ && this.refillBucket(i, n, o)) return;
    let s = _ === 0 ? 1 : 0;
    ((u['xp_furniture:has_water'] = s),
      o.playSound(s ? 'bucket.fill_water' : 'bucket.empty_water', n.location),
      n.setPermutation(Q(a.type.id, u)));
  }
  refillBucket(r, t, n) {
    let o = y.getEquippableComponent(r);
    if (!o) return !1;
    let i = y.getInventoryComponent(r)?.container;
    if (!i) return !1;
    try {
      let a = o.getEquipmentSlot(nl.Mainhand);
      if (!a) return !1;
      if (a && a.typeId === E.Bucket) {
        if (a.amount > 1) {
          a.setItem(new uo(E.Bucket, a.amount - 1));
          let u = i.addItem(new uo(E.WaterBucket, 1));
          u && (i.emptySlotsCount > 0 ? i.addItem(u) : n.spawnItem(u, r.location));
        } else a.setItem(new uo(E.WaterBucket, 1));
        return (n.playSound('bucket.fill_water', t.location), !0);
      }
    } catch {
      return !1;
    }
    return !1;
  }
};
((Lr.componentId = 'xp_furniture:small_fountain'),
  d([m], Lr.prototype, 'beforeOnPlayerPlace', 1),
  d([m], Lr.prototype, 'onPlayerInteract', 1),
  (Lr = d([x], Lr)));
import {
  BlockPermutation as _o,
  EquipmentSlot as ol,
  GameMode as Ii,
  ItemComponentTypes as il,
  system as al,
} from '@minecraft/server';
var Y = h.getLogger('FurniturePack', 'Interactive', 'Umbrella'),
  Ti = { 11: f.from(0, 0, 0), 12: f.from(0, 1, 0), 13: f.from(0, 2, 0) },
  _t = {
    8: f.from(-1, 2, -1),
    2: f.from(1, 2, -1),
    0: f.from(1, 2, 1),
    6: f.from(-1, 2, 1),
    4: f.from(0, 2, 0),
    1: f.from(1, 2, 0),
    7: f.from(-1, 2, 0),
    3: f.from(0, 2, 1),
    5: f.from(0, 2, -1),
    10: f.from(0, 0, 0),
    9: f.from(0, 1, 0),
  },
  He = class {
    onPlayerInteract(r) {
      let { block: t, dimension: n, player: o } = r,
        i = f.from(t.location);
      if (o === void 0) return;
      let a = t.permutation.getState('xp_furniture:multiblock_part');
      if (a === void 0) {
        Y.error("Block does not have 'xp_furniture:multiblock_part' state.");
        return;
      }
      let u =
        a === 9
          ? { neighbor: t.above(), expectedPart: 10, newPart: 10 }
          : a === 10
            ? { neighbor: t.below(), expectedPart: 9, newPart: 9 }
            : null;
      if (u) {
        u.neighbor?.permutation.getState('xp_furniture:multiblock_part') === u.expectedPart &&
          (Y.info(`Swapping block part from ${a} to ${u.newPart} due to update.`),
          t.setPermutation(Q(t.typeId, { 'xp_furniture:multiblock_part': u.newPart })),
          u.neighbor?.setPermutation(Q(u.neighbor.typeId, { 'xp_furniture:multiblock_part': a })));
        return;
      }
      if (a <= 10) {
        let _ = this.closeUmbrella(t, +a);
        n.playSound(_ ? 'xp_furniture:curtains.close' : 'xp_furniture:parasol_fail', i);
      } else {
        let _ = this.openUmbrella(t, +a);
        n.playSound(_ ? 'xp_furniture:curtains.open' : 'xp_furniture:parasol_fail', i);
      }
    }
    beforeOnPlayerPlace(r, t) {
      let n = this.getAffectedBlocks(r.block);
      if (!this.canBePlaced(n) || !n || n.length !== 3) {
        r.cancel = !0;
        return;
      }
      let o = r.permutationToPlace.type.id;
      ((r.permutationToPlace = Q(o, { 'xp_furniture:multiblock_part': 11 })),
        al.run(() => {
          let i = 12;
          for (let a of n.filter((u, _) => _ !== 0))
            (a.setPermutation(Q(o, { 'xp_furniture:multiblock_part': i })), i++);
        }));
    }
    onPlayerBreak(r) {
      let { brokenBlockPermutation: t, dimension: n, player: o } = r;
      if (
        !o ||
        y
          .getEquippableComponent(o)
          ?.getEquipment(ol.Mainhand)
          ?.getComponent(il.Enchantable)
          ?.hasEnchantment(Dr.SilkTouch)
      )
        return;
      let u = o.getGameMode();
      if (u && u !== Ii.Creative && u !== Ii.Spectator) {
        let _ = t.getItemStack();
        _ && n.spawnItem(_, f.from(r.block.location));
      }
    }
    onBreak(r, t) {
      let n = r.brokenBlockPermutation.getState('xp_furniture:multiblock_part');
      if ((Y.info(typeof n, n), this.isClosed(n))) {
        let o = this.getClosedBlocks(r.block, n);
        if (o.length === 0) {
          Y.debug('Cannot break umbrella: closed blocks are not defined.');
          return;
        }
        for (let i of o)
          i.dimension.runCommand(
            `setblock ${f.from(i.location).toString('short', ' ')} air destroy`,
          );
      } else {
        let o = this.getOpenBlocks(r.block, n);
        if (o.length === 0) {
          Y.debug('Cannot break umbrella: open blocks are not defined.');
          return;
        }
        for (let i of o)
          i.dimension.runCommand(
            `setblock ${f.from(i.location).toString('short', ' ')} air destroy`,
          );
      }
    }
    getAffectedBlocks(r) {
      let t = r.above();
      if (!t) return (Y.debug('Cannot place umbrella: block above is not defined.'), []);
      let n = t.above();
      return n ? [r, t, n] : (Y.debug('Cannot place umbrella: block above 2 is not defined.'), []);
    }
    closeUmbrella(r, t) {
      if (this.isClosed(t)) return (Y.debug('Cannot close umbrella: it is already closed.'), !1);
      let n = this.getCurrentOffset(t),
        o = r.dimension,
        i = f.from(r.location),
        a = o.getBlock(i.subtract(n));
      return a ? ul(a) : (Y.debug('Cannot close umbrella: base block is not defined.'), !1);
    }
    openUmbrella(r, t) {
      if (!this.isClosed(t)) return (Y.debug('Cannot open umbrella: it is open.'), !1);
      let n = this.getOpenBlocks(r),
        o = this.getBaseBlock(r);
      return o === void 0 || !o
        ? (Y.debug('Cannot open umbrella: base block is not defined.'), !1)
        : this.canOpen(o)
          ? _l(o, n)
          : (Y.debug('Cannot open umbrella: blocks are not replaceable.'), !1);
    }
    isClosed(r) {
      return (
        Y.info(typeof r),
        typeof r == 'number'
          ? r > 10
          : (Y.info('wtf', typeof r), r.permutation.getState('xp_furniture:multiblock_part') > 10)
      );
    }
    getBaseBlock(r, t) {
      t === void 0 && (t = r.permutation.getState('xp_furniture:multiblock_part'));
      let n = this.getCurrentOffset(t),
        o = r.dimension,
        i = f.from(r.location);
      return o.getBlock(i.subtract(n));
    }
    getClosedBlocks(r, t) {
      (t === void 0 && (t = r.permutation.getState('xp_furniture:multiblock_part')),
        Y.info('getClosedBlocks', typeof t, t));
      let n = this.getCurrentOffset(t),
        o = Object.values(Ti).map((_) => _.subtract(n)),
        i = r.dimension,
        a = f.from(r.location),
        u = [];
      for (let _ of o) {
        let s = i.getBlock(a.add(_));
        s ? u.push(s) : Y.debug('Cannot get closed blocks: block is not defined.');
      }
      return u;
    }
    getOpenBlocks(r, t) {
      let n = this.getBaseBlock(r, t);
      if (!n) return (Y.debug('Cannot get open blocks: base block is not defined.'), []);
      let o = Object.values(_t),
        i = r.dimension,
        a = f.from(n.location),
        u = [];
      for (let _ of o) {
        let s = i.getBlock(a.add(_));
        s ? u.push(s) : Y.debug('Cannot get open blocks: block is not defined.');
      }
      return u;
    }
    canOpen(r) {
      let n = Object.values(_t)
        .filter((o) => Math.abs(o.x) + Math.abs(o.z) > 0)
        .map((o) => r.dimension.getBlock(f.from(r.location).add(o)))
        .filter((o) => o !== void 0);
      if (n.length !== 8)
        return (Y.debug('Cannot open umbrella: not enough blocks found.', n.length), !1);
      for (let o of n)
        if (!q.isReplaceableBlock(o, !1))
          return (Y.debug('Cannot open umbrella: block', o.typeId, 'is not replaceable.'), !1);
      return !0;
    }
    getCurrentOffset(r) {
      return this.isClosed(r) ? Ti[r.toString()] : _t[r.toString()];
    }
    canBePlaced(r) {
      for (let t of r)
        if (!q.isReplaceableBlock(t, !1))
          return (Y.debug('Cannot place umbrella: block', t.typeId, 'is not replaceable.'), !1);
      return !0;
    }
  };
((He.componentId = 'xp_furniture:umbrella'),
  d([m], He.prototype, 'onPlayerInteract', 1),
  d([m], He.prototype, 'beforeOnPlayerPlace', 1),
  d([m], He.prototype, 'onPlayerBreak', 1),
  d([m], He.prototype, 'onBreak', 1),
  (He = d([x], He)));
function ul(e) {
  let r = e.permutation.getAllStates(),
    t = { ...r };
  t['xp_furniture:multiblock_part'] = 11;
  let n = { ...r };
  n['xp_furniture:multiblock_part'] = 12;
  let o = { ...r };
  o['xp_furniture:multiblock_part'] = 13;
  let i = e.above();
  if (i === void 0) return (Y.debug('Mid block not found.'), !1);
  let a = i.above();
  return a === void 0
    ? (Y.debug('Top block not found.'), !1)
    : (e.dimension.runCommand(
        `fill ${a.location.x - 1} ${a.location.y} ${a.location.z - 1} ${a.location.x - 1} ${a.location.y} ${a.location.z + 1} air replace ${a.typeId}`,
      ),
      e.dimension.runCommand(
        `fill ${a.location.x + 1} ${a.location.y} ${a.location.z - 1} ${a.location.x + 1} ${a.location.y} ${a.location.z + 1} air replace ${a.typeId}`,
      ),
      e.dimension.runCommand(
        `fill ${a.location.x} ${a.location.y} ${a.location.z + 1} ${a.location.x} ${a.location.y} ${a.location.z + 1} air replace ${a.typeId}`,
      ),
      e.dimension.runCommand(
        `fill ${a.location.x} ${a.location.y} ${a.location.z - 1} ${a.location.x} ${a.location.y} ${a.location.z - 1} air replace ${a.typeId}`,
      ),
      e.setPermutation(_o.resolve(e.typeId, t)),
      i.setPermutation(_o.resolve(i.typeId, n)),
      a.setPermutation(_o.resolve(a.typeId, o)),
      !0);
}
function _l(e, r) {
  let t = e.above();
  if (t === void 0) return (Y.debug('Mid block not found.'), !1);
  if (t.above() === void 0) return (Y.debug('Top block not found.'), !1);
  t.dimension.spawnParticle('xp_furniture:umbrella.open', t.center());
  let o = e.typeId,
    i = f.from(e.location);
  for (let a of r) {
    let u = f.from(a.location).subtract(i),
      _ = Object.keys(_t).find((s) => _t[s].equals(u) || _t[s].equals(u.multiply(-1)));
    a.setPermutation(Q(o, { 'xp_furniture:multiblock_part': _ ? +_ : 0 }));
  }
  return !0;
}
import {
  ItemStack as Mi,
  system as ea,
  TicksPerSecond as sl,
  world as seasonWorld,
} from '@minecraft/server';
var Me = [
  {
    type: 'halloween',
    duration: { start: { month: 10, day: 14 }, end: { month: 11, day: 10 } },
    affectedEntities: [
      'xp_furniture:big_cauldron',
      'xp_furniture:merchant',
      'xp_furniture:scarecrow',
      'xp_furniture:standing_camera',
    ],
    affectedItems: [{ from: 'xp_furniture:scarecrow', to: 'xp_furniture:scarecrow_halloween' }],
  },
  {
    type: 'christmas',
    duration: { start: { month: 12, day: 1 }, end: { month: 12, day: 26 } },
    affectedEntities: [
      'xp_furniture:big_chest',
      'xp_furniture:slab_chest',
      'xp_furniture:standing_camera',
      'xp_furniture:merchant',
      'xp_furniture:mob_plushie',
    ],
    affectedItems: [
      { from: 'xp_furniture:oak_big_chest', to: 'xp_furniture:oak_big_chest_christmas' },
      { from: 'xp_furniture:oak_slab_chest', to: 'xp_furniture:oak_slab_chest_christmas' },
    ],
  },
];
var seasonalDefinitions = new Map(Me.map((e) => [e.type, e])),
  seasonalEntityTypesBySeason = new Map(Me.map((e) => [e.type, new Set(e.affectedEntities || [])])),
  seasonalTypes = new Set(Me.map((e) => e.type)),
  seasonalEntityTypeIds = new Set(Me.flatMap((e) => e.affectedEntities || [])),
  seasonalItemMappings = Me.flatMap((e) => e.affectedItems || []),
  inventoryMaintenanceScans = new Set();
function scheduleInventoryMaintenanceScan(e) {
  if (!e?.isValid || inventoryMaintenanceScans.has(e.id)) return;
  (inventoryMaintenanceScans.add(e.id),
    ea.runTimeout(() => {
      (inventoryMaintenanceScans.delete(e.id), T.applyToPlayerInventory(e), Sn?.main(e));
    }, 1));
}
var lt = h.getLogger('FurniturePack', 'VFX', 'SeasonalChanges'),
  br = null,
  T = class {
    static getNearbyEntities(r, t) {
      return r.dimension
        .getEntities({ location: r.location, maxDistance: this.SEARCH_RADIUS })
        .filter((n) => t.has(n.typeId));
    }
    static getSeason() {
      let r = new Date(),
        t = r.getMonth() + 1,
        n = r.getDate(),
        o = Ke().event;
      if (o !== 'none') return o;
      for (let i of Me) {
        let { start: a, end: u } = i.duration;
        if (this.isDateInRange(t, n, a, u)) return i.type;
      }
      return 'none';
    }
    static isDateInRange(r, t, n, o) {
      let i = r * 100 + t,
        a = n.month * 100 + n.day,
        u = o.month * 100 + o.day;
      return a <= u ? i >= a && i <= u : i >= a || i <= u;
    }
    static applyToEntity(r, t) {
      if (!t?.isValid) return;
      if (t.getProperty(this.SEASONAL_PROPERTY) === r) return;
      let n = !0,
        o = !0;
      try {
        t.setProperty(this.SEASONAL_PROPERTY, r);
      } catch {
        n = !1;
      }
      try {
        t.triggerEvent(`xp_furniture:is_${r}`);
      } catch {
        o = !1;
      }
      if (n || o) {
        let i = n ? (o ? '' : 'event') : 'property',
          a = i ? `\xA7e (with missing ${i})\xA7r` : '';
        lt.info(`Applied ${r} to ${t.typeId}${a}`);
      } else lt.error(`Failed to apply ${r} to ${t.typeId}`);
    }
    static resetEntity(r) {
      if (!r?.isValid || !seasonalTypes.has(r.getProperty(this.SEASONAL_PROPERTY))) return;
      try {
        r.setProperty(this.SEASONAL_PROPERTY, 'none');
      } catch {}
      try {
        r.triggerEvent(this.DEFAULT_SEASON_EVENT);
      } catch {}
      lt.info(`Reset ${r.typeId} to default season`);
    }
    static applyToLoadedEntity(r, t = br ?? this.getSeason()) {
      if (!r?.isValid || !seasonalEntityTypeIds.has(r.typeId)) return;
      let n = seasonalEntityTypesBySeason.get(t);
      n?.has(r.typeId) ? this.applyToEntity(t, r) : this.resetEntity(r);
    }
    static updateInventorySlot(r, t, n = br ?? this.getSeason()) {
      if (!r?.isValid) return;
      let o = y.getInventoryComponent(r)?.container;
      if (!o || t < 0 || t >= o.size) return;
      let i = o.getItem(t);
      if (!i) return;
      let a = seasonalDefinitions.get(n)?.affectedItems || [],
        u = a.find((s) => s.to === i.typeId);
      if (u) return;
      let _ = a.find((s) => s.from === i.typeId);
      _ || (_ = seasonalItemMappings.find((s) => s.to === i.typeId));
      _ && _.to !== i.typeId && o.setItem(t, new Mi(_.to, i.amount));
      !a.includes(_) && _?.to === i.typeId && o.setItem(t, new Mi(_.from, i.amount));
    }
    static applyToPlayer(r, t = br ?? this.getSeason()) {
      if (!r?.isValid) return;
      for (let n of this.getNearbyEntities(r, seasonalEntityTypeIds))
        this.applyToLoadedEntity(n, t);
      this.applyToPlayerInventory(r, t);
    }
    static applyToPlayerInventory(r, t = br ?? this.getSeason()) {
      if (!r?.isValid) return;
      let o = y.getInventoryComponent(r)?.container;
      if (!o) return;
      for (let n = 0; n < o.size; n++) this.updateInventorySlot(r, n, t);
    }
    static schedulePlayerInventoryScan(r) {
      scheduleInventoryMaintenanceScan(r);
    }
    static applyToAllLoadedEntities(r) {
      for (let t of ['minecraft:overworld', 'minecraft:nether', 'minecraft:the_end']) {
        let n;
        try {
          n = seasonWorld.getDimension(t);
        } catch {
          continue;
        }
        for (let o of seasonalEntityTypeIds)
          for (let i of n.getEntities({ type: o })) this.applyToLoadedEntity(i, r);
      }
    }
    static applySurroundings(r) {
      for (let t of y.getAllPlayers()) this.applyToPlayer(t, r);
    }
    static removeSurroundings() {
      this.applySurroundings('none');
    }
    static checkForSeasonChange() {
      let r = this.getSeason();
      if (br === r) return;
      (lt.info(`Season changing from \xA7e${br || 'none'}\xA7r to \xA7e${r}\xA7r`), (br = r));
      (this.applyToAllLoadedEntities(r),
        y.getAllPlayers().forEach((t) => this.applyToPlayerInventory(t, r)));
    }
    static init() {
      seasonWorld.afterEvents.entityLoad.subscribe((r) => this.applyToLoadedEntity(r.entity));
      seasonWorld.afterEvents.entitySpawn.subscribe((r) => this.applyToLoadedEntity(r.entity));
      seasonWorld.afterEvents.playerSpawn.subscribe((r) => {
        ea.runTimeout(() => this.applyToPlayer(r.player), 1);
      });
      seasonWorld.afterEvents.playerInventoryItemChange.subscribe((r) => {
        this.schedulePlayerInventoryScan(r.player);
      });
      seasonWorld.afterEvents.playerLeave.subscribe((r) =>
        inventoryMaintenanceScans.delete(r.playerId),
      );
      ea.runTimeout(() => {
        (this.checkForSeasonChange(),
          ea.runInterval(() => this.checkForSeasonChange(), this.CHECK_INTERVAL));
      }, 8 * sl);
    }
  };
((T.SEARCH_RADIUS = 6),
  (T.CHECK_INTERVAL = 60 * sl),
  (T.SEASONAL_PROPERTY = 'xp_furniture:is_season'),
  (T.DEFAULT_SEASON_EVENT = 'xp_furniture:is_default_season'));
T.init();
var qr = class {
  onPlayerBreak(r) {
    let { block: t, dimension: n } = r;
    n.playSound('break.decorated_pot', t.center());
  }
  onRandomTick(r) {
    let { block: t } = r;
    (Math.random() > 0.5 && T.getSeason() !== 'halloween') ||
      (t.dimension.spawnParticle('xp_furniture:ghost_particle', {
        x: t.center().x,
        y: t.center().y + 0.5,
        z: t.center().z,
      }),
      t.dimension.playSound('shriek.sculk_shrieker', t.center(), {
        volume: 0.125,
        pitch: Math.random() * 1.5 + 0.25,
      }));
  }
};
((qr.componentId = 'xp_furniture:urn'),
  d([m], qr.prototype, 'onPlayerBreak', 1),
  d([m], qr.prototype, 'onRandomTick', 1),
  (qr = d([x], qr)));
import { EquipmentSlot as st, GameMode as xr, ItemStack as dt } from '@minecraft/server';
var zr = class {
  constructor() {
    this.log = h.getLogger('SinkComponent');
    this.waterStateId = 'xp_furniture:has_water';
  }
  onPlayerInteract(r) {
    let t = r.player;
    if (!t) return;
    let n = W.getHeldItem(t);
    if (!n) return;
    let o = r.block,
      i = o.permutation.getAllStates(),
      a = i[this.waterStateId];
    if (a === void 0) {
      this.log.info(`Water state is undefined for block ${o.typeId}`);
      return;
    }
    let u = t.getGameMode(),
      _ = t.dimension,
      s = f.from(o.center()).add(0, 0.5, 0);
    if (a === 0) {
      if (n.typeId === E.WaterBucket || n.typeId === Ce.WateringCanItem) {
        if (_.id === zn.Nether) {
          if (
            (_.spawnParticle('xp_furniture:evaporate', s),
            _.playSound('random.fizz', s),
            u === xr.Survival || u === xr.Adventure)
          ) {
            let c = y.getEquippableComponent(t);
            c &&
              (n.typeId === E.WaterBucket
                ? c.setEquipment(st.Mainhand, new dt(E.Bucket, 1))
                : n.typeId === Ce.WateringCanItem &&
                  c.setEquipment(st.Mainhand, new dt(Ce.WateringCanEmptyItem, 1)));
          }
        } else if (
          ((i[this.waterStateId] = 1),
          o.setPermutation(Q(o.typeId, i)),
          _.playSound('bucket.fill_water', t.location),
          u === xr.Survival || u === xr.Adventure)
        ) {
          let c = y.getEquippableComponent(t);
          c &&
            (n.typeId === E.WaterBucket
              ? c.setEquipment(st.Mainhand, new dt(E.Bucket, 1))
              : n.typeId === Ce.WateringCanItem &&
                c.setEquipment(st.Mainhand, new dt(Ce.WateringCanEmptyItem, 1)));
        }
      }
    } else if (a === 1)
      if (n.typeId === E.Bucket || n.typeId === Ce.WateringCanEmptyItem) {
        if (
          ((i[this.waterStateId] = 0),
          o.setPermutation(Q(o.typeId, i)),
          _.playSound('bucket.empty_water', t.location),
          u === xr.Survival || u === xr.Adventure)
        ) {
          let c = y.getEquippableComponent(t);
          c &&
            (n.typeId === E.Bucket
              ? n.amount > 1
                ? (t.runCommand(`give @s ${E.WaterBucket} 1`), W.decrementStack(t, n))
                : c.setEquipment(st.Mainhand, new dt(E.WaterBucket, 1))
              : n.typeId === Ce.WateringCanEmptyItem &&
                c.setEquipment(st.Mainhand, new dt(Ce.WateringCanItem, 1)));
        }
      } else
        n.typeId === E.GlassBottle &&
          (t.runCommand(`give @s ${E.Potion} 1`),
          _.playSound('cauldron.takewater', s),
          _.playSound('bottle.fill', s),
          (u === xr.Survival || u === xr.Adventure) && W.decrementStack(t, n));
  }
};
((zr.componentId = 'xp_furniture:water_fillable'),
  d([m], zr.prototype, 'onPlayerInteract', 1),
  (zr = d([x], zr)));
import {
  EntityComponentTypes as ra,
  EquipmentSlot as cn,
  ItemStack as lo,
} from '@minecraft/server';
var Rr = class {
  constructor() {
    this.log = h.getLogger('Aquarium');
  }
  onPlayerInteract(r) {
    let { block: t, player: n, dimension: o } = r;
    if (!n) return;
    let i = y.getEquippableComponent(n),
      a = i?.getEquipment(cn.Mainhand);
    if (!i || !a) return;
    let u = D.getEntityFromBlock(t, { searchRadius: 2 });
    if (!u) return;
    let s = {
      'minecraft:water_bucket': () => this.updateWater('increment', u, i, o),
      'minecraft:bucket': () => this.updateWater('decrement', u, i, o),
      'minecraft:salmon_bucket': () => this.addFish('salmon', u, i, o),
      'minecraft:cod_bucket': () => this.addFish('cod', u, i, o),
      'minecraft:pufferfish_bucket': () => this.addFish('pufferfish', u, i, o),
      'minecraft:tropical_fish_bucket': () => this.addFish('tropical_fish', u, i, o),
      'minecraft:axolotl_bucket': () => this.addFish('axolotl', u, i, o),
      'minecraft:tadpole_bucket': () => this.addFish('tadpole', u, i, o),
    }[a.typeId];
    s && s();
  }
  updateWater(r, t, n, o) {
    let i = t.getComponent(ra.Variant)?.value ?? 0,
      a = i + (r === 'increment' ? 1 : -1);
    if ((this.log.debug('newV: ' + a), a < 0 || a > 2)) return;
    let u = a === 0 ? 'empty' : a === 1 ? 'half_full' : 'full';
    t.triggerEvent('xp_furniture:' + u);
    let _ = t.getProperty('xp_furniture:fish_type');
    (_ !== 'empty' && r === 'decrement' && t.triggerEvent('xp_furniture:fish_type.empty'),
      n.setEquipment(
        cn.Mainhand,
        new lo(
          r === 'increment'
            ? 'minecraft:bucket'
            : `minecraft:${_ === 'empty' ? 'water' : _}_bucket`,
          1,
        ),
      ),
      this.log.info(`Returned bucket: ${_}`));
    let s = r === 'increment' ? 'bucket.fill_water' : 'bucket.empty_water';
    (o.playSound(s, t.location), this.log.info(`Updated water: ${i} -> ${a}`));
  }
  addFish(r, t, n, o) {
    let i = t.getComponent(ra.Variant)?.value ?? 0,
      a = t.getProperty('xp_furniture:fish_type');
    if (a !== 'empty') {
      this.log.info(`Aquarium already has fish: ${a}`);
      return;
    }
    (t.triggerEvent('xp_furniture:fish_type.' + r),
      o.playSound('bucket.fill_fish', t.location),
      i < 2
        ? (n.setEquipment(cn.Mainhand, new lo('minecraft:bucket', 1)),
          this.log.info(`Added fish: ${r}, returned empty bucket`))
        : (n.setEquipment(cn.Mainhand, new lo('minecraft:water_bucket', 1)),
          this.log.info(`Added fish: ${r}, returned filled bucket`)));
  }
};
((Rr.componentId = 'xp_furniture:aquarium'),
  d([m], Rr.prototype, 'onPlayerInteract', 1),
  (Rr = d([x], Rr)));
import {
  BlockPermutation as dl,
  Direction as M,
  system as ta,
  TicksPerSecond as na,
} from '@minecraft/server';
var be = class {
  constructor() {
    this.log = h.getLogger('BarredDoor');
  }
  onPlayerInteract(r) {
    let { block: t, face: n, player: o, dimension: i } = r;
    if (n === M.Up || n === M.Down) return;
    let a = {
        [M.North]: { front: M.South, back: M.North },
        [M.South]: { front: M.North, back: M.South },
        [M.East]: { front: M.West, back: M.East },
        [M.West]: { front: M.East, back: M.West },
        [M.Up]: { front: M.South, back: M.North },
        [M.Down]: { front: M.South, back: M.North },
      },
      u = t.permutation.getState('minecraft:cardinal_direction') ?? 'south',
      _ = a[u.charAt(0).toUpperCase() + u.slice(1)];
    if (!_) return;
    let s = D.getEntityFromBlock(t, { searchRadius: 5 });
    if (!s) return;
    let c = s.getProperty(be.ACTOR_PROP_NAMES.OpenState),
      p = s.getProperty(be.ACTOR_PROP_NAMES.IsBarredFront),
      w = s.getProperty(be.ACTOR_PROP_NAMES.IsBarredBack);
    if (o && o.isSneaking) {
      _.front === n
        ? s.setProperty(be.ACTOR_PROP_NAMES.IsBarredFront, !p)
        : _.back === n && s.setProperty(be.ACTOR_PROP_NAMES.IsBarredBack, !w);
      return;
    }
    if (this.beginCooldown(s) > 0) return;
    if (p || w) {
      this.setDoorOpenState(s, 'shake');
      return;
    }
    let C = !1;
    c === 'false'
      ? _.front === n
        ? (this.setDoorOpenState(s, 'front'), this.log.debug('Door opened from the front'))
        : _.back === n &&
          (this.setDoorOpenState(s, 'back'), (C = !0), this.log.debug('Door opened from the back'))
      : this.setDoorOpenState(s, 'false');
    let P = D.getBlockLocationsFromEntity(s);
    if (!(!P || P.length === 0))
      for (let O of P) {
        let F = i.getBlock(O),
          B = F?.typeId;
        if (!B || t.typeId !== B) continue;
        let A = F.permutation.getAllStates();
        ((A['xp_furniture:has_collision'] = c !== 'false'),
          (A['xp_furniture:is_reversed'] = C),
          F.setPermutation(dl.resolve(B, A)));
      }
  }
  setDoorOpenState(r, t) {
    let n = be.ACTOR_PROP_NAMES.OpenState;
    (r.setProperty(n, t),
      t === 'shake' &&
        ta.runTimeout(() => {
          !r || !r.isValid || this.setDoorOpenState(r, 'false');
        }, 10));
  }
  beginCooldown(r) {
    let t = 'xp_furniture:interaction_date',
      n = ta.currentTick,
      o = r.getDynamicProperty(t) ?? 0,
      i = na * 3;
    return n - o < i ? (i - (n - o)) / na : (r.setDynamicProperty(t, n), 0);
  }
};
((be.componentId = 'xp_furniture:barred_door'),
  (be.ACTOR_PROP_NAMES = {
    OpenState: 'xp_furniture:open_state',
    IsBarredFront: 'xp_furniture:is_barred_front',
    IsBarredBack: 'xp_furniture:is_barred_back',
  }),
  d([m], be.prototype, 'onPlayerInteract', 1),
  (be = d([x], be)));
var ct = class {
  constructor() {
    this.log = h.getLogger('BarredDoorCollision');
  }
  onTick(r) {
    let { block: t } = r;
    (t.setType('minecraft:air'),
      this.log.debug('Removed barred door collision block at', t.location));
  }
};
((ct.componentId = 'xp_furniture:barred_door_collision'),
  d([m], ct.prototype, 'onTick', 1),
  (ct = d([x], ct)));
import { ItemStack as oa } from '@minecraft/server';
import { world as wr } from '@minecraft/server';
var zt = class zt {
  constructor(r) {
    this.dataCache = null;
    this.allowBlockMismatch = !1;
    if (!r || !r.isValid) throw new Error('Cannot instantiate BlockDB with an invalid block.');
    this.block = r;
    let t = r.location;
    this.propertyId = `fdb:${r.dimension.id.replace(/.*:/g, '')}_${t.x}_${t.y}_${t.z}`;
  }
  setAllowBlockMismatch(r) {
    this.allowBlockMismatch = r;
  }
  get(r) {
    return this.load()[r];
  }
  set(r, t) {
    if (t === void 0) {
      this.delete(r);
      return;
    }
    let n = this.load();
    ((n[r] = t), this.save(n));
  }
  has(r) {
    return r in this.load();
  }
  delete(r) {
    let t = this.load();
    return r in t ? (delete t[r], this.save(t), !0) : !1;
  }
  clear() {
    let r = wr.getDynamicProperty(this.propertyId);
    if (typeof r == 'string')
      try {
        let t = JSON.parse(r);
        if (t?.__isChunked && typeof t?.__chunkCount == 'number')
          for (let n = 0; n < t.__chunkCount; n++)
            wr.setDynamicProperty(`${this.propertyId}_${n}`, void 0);
      } catch {}
    (wr.setDynamicProperty(this.propertyId, void 0), (this.dataCache = {}));
  }
  keys() {
    return Object.keys(this.load());
  }
  values() {
    return Object.values(this.load());
  }
  entries() {
    return Object.entries(this.load());
  }
  entity(r = {}) {
    let { spawnAsNeeded: t, direction: n, entityToSpawn: o } = r,
      i = this.block.dimension.getEntitiesAtBlockLocation(this.block.location);
    return (
      i.length === 0 &&
        t &&
        o &&
        (q.summonAuxiliaryEntity(this.block, o, {
          spawnEvent: 'xp_furniture:is_uninteractable',
          targetRotation:
            n ??
            q.getBlockInFace(
              this.block,
              this.block.permutation.getState('minecraft:cardinal_direction') ?? 'south',
              10,
            )?.location,
          centerBlock: !0,
        }),
        (i = this.block.dimension.getEntitiesAtBlockLocation(this.block.location))),
      i.find((a) => a.typeId === (i.length > 0 ? i[0].typeId : o))
    );
  }
  load() {
    if (this.dataCache) return this.dataCache;
    let r = wr.getDynamicProperty(this.propertyId);
    if (typeof r != 'string' || !r) return ((this.dataCache = {}), this.dataCache);
    let t;
    try {
      let n = JSON.parse(r);
      if (n?.__isChunked && typeof n?.__chunkCount == 'number') {
        let o = [];
        for (let i = 0; i < n.__chunkCount; i++) {
          let a = wr.getDynamicProperty(`${this.propertyId}_${i}`);
          if (typeof a != 'string')
            throw new Error(`Chunk ${i} is missing or invalid for ${this.propertyId}.`);
          o.push(a);
        }
        t = o.join('');
      } else t = r;
    } catch {
      t = r;
    }
    try {
      let n = JSON.parse(t);
      return (typeof n.__typeId != 'string' || n.__typeId !== this.block.typeId) &&
        !this.allowBlockMismatch
        ? (zt.logger.warn(
            `Block type mismatch at ${this.propertyId}. Expected ${n.__typeId ?? 'N/A'} but found ${this.block.typeId}. Discarding stale data.`,
          ),
          this.clear(),
          (this.dataCache = {}),
          this.dataCache)
        : (delete n.__typeId, (this.dataCache = n), this.dataCache);
    } catch (n) {
      return (
        zt.logger.warn(
          `Failed to parse BlockDB data for ${this.propertyId}. Data may be corrupt. Error: ${n}`,
        ),
        this.clear(),
        (this.dataCache = {}),
        this.dataCache
      );
    }
  }
  save(r) {
    let t = { __typeId: this.block.typeId, ...r },
      n = JSON.stringify(t),
      o = 32767;
    if ((this.clear(), n.length > o)) {
      let i = Math.ceil(n.length / o),
        a = { __isChunked: !0, __chunkCount: i };
      wr.setDynamicProperty(this.propertyId, JSON.stringify(a));
      for (let u = 0; u < i; u++) {
        let _ = n.slice(u * o, (u + 1) * o);
        wr.setDynamicProperty(`${this.propertyId}_${u}`, _);
      }
    } else wr.setDynamicProperty(this.propertyId, n);
    this.dataCache = r;
  }
};
zt.logger = h.getLogger('FurniturePack', 'Utilities', 'BlockDB');
var er = zt;
var pn = h.getLogger('FurniturePack', 'Interactive', 'Basket'),
  ia = ['apple', 'carrot', 'potato'],
  Fr = class {
    onPlayerInteract(r) {
      let { block: t, player: n } = r;
      if (!n) return;
      let o = new er(t),
        i = W.getHeldItem(n),
        a = o.get('count') ?? 0;
      if (
        i &&
        ((t.typeId === 'xp_furniture:empty_basket' &&
          ia.includes(i.typeId.replace('minecraft:', ''))) ||
          (ia.some((u) => t.typeId === `xp_furniture:${u}_basket`) &&
            t.typeId.includes(i.typeId.replace('minecraft:', '')))) &&
        a < 64
      ) {
        let u = i.typeId.replace('minecraft:', '');
        ((t.typeId === 'xp_furniture:empty_basket' || t.typeId !== `xp_furniture:${u}_basket`) &&
          t.setType(`xp_furniture:${u}_basket`),
          o.set('count', a + 1));
        let _ = a + 1;
        (W.decrementStack(n, i.typeId),
          t.dimension.playSound('random.pop2', t.location, { pitch: Math.lerp(0.75, 2, _ / 64) }),
          pn.info(`Added ${i.typeId} to basket (${_}/64)`));
      } else if (a > 0) {
        let u = t.typeId.replace(/(xp_furniture:|_basket)/gm, '');
        (a === 1 && t.setType('xp_furniture:empty_basket'), o.set('count', a - 1));
        let _ = a - 1;
        (W.incrementStack(n, `minecraft:${u}`),
          t.dimension.playSound('random.pop2', t.location, {
            pitch: Math.lerp(0.75, 2, Math.max(_, 1) / 64),
          }),
          pn.info(`Removed item from basket (${_}/64)`),
          _ === 0 && (o.clear(), pn.info('Cleared BlockDB entry as this basket is now empty')));
      }
    }
    onBreak(r) {
      let { block: t, brokenBlockPermutation: n, dimension: o } = r,
        i = n.type.id;
      if (i === 'xp_furniture:empty_basket') return;
      let a = new er(t);
      a.setAllowBlockMismatch(!0);
      let u = a.get('count') ?? 0,
        s = `minecraft:${i.replace(/(xp_furniture:|_basket)/gm, '')}`;
      (a.clear(), pn.info(`Dropping ${s} x ${u} from basket`));
      let c = t.bottomCenter();
      (o.spawnItem(new oa('xp_furniture:empty_basket', 1), c),
        u > 0 && o.spawnItem(new oa(s, u), c));
    }
  };
((Fr.componentId = 'xp_furniture:basket'),
  d([m], Fr.prototype, 'onPlayerInteract', 1),
  d([m], Fr.prototype, 'onBreak', 1),
  (Fr = d([x], Fr)));
import { system as pl } from '@minecraft/server';
var fn = [
  { result: 'awkward_potion', ingredients: ['nether_wart'] },
  { result: 'mundane_potion', ingredients: ['spider_eye'] },
  { result: 'mundane_potion', ingredients: ['ghast_tear'] },
  { result: 'mundane_potion', ingredients: ['rabbit_foot'] },
  { result: 'mundane_potion', ingredients: ['blaze_powder'] },
  { result: 'mundane_potion', ingredients: ['glistering_melon'] },
  { result: 'mundane_potion', ingredients: ['sugar'] },
  { result: 'mundane_potion', ingredients: ['magma_cream'] },
  { result: 'mundane_potion', ingredients: ['redstone'] },
  { result: 'thick_potion', ingredients: ['glowstone_dust'] },
  { result: 'weakness_potion', ingredients: ['fermented_spider_eye'] },
  { result: 'swiftness_potion', ingredients: ['awkward_potion', 'sugar'] },
  { result: 'jump_boost_potion', ingredients: ['awkward_potion', 'rabbit_foot'] },
  { result: 'strength_potion', ingredients: ['awkward_potion', 'blaze_powder'] },
  { result: 'healing_potion', ingredients: ['awkward_potion', 'glistering_melon'] },
  { result: 'poison_potion', ingredients: ['awkward_potion', 'spider_eye'] },
  { result: 'regeneration_potion', ingredients: ['awkward_potion', 'ghast_tear'] },
  { result: 'fire_resistance_potion', ingredients: ['awkward_potion', 'magma_cream'] },
  { result: 'water_breathing_potion', ingredients: ['awkward_potion', 'pufferfish'] },
  { result: 'night_vision_potion', ingredients: ['awkward_potion', 'golden_carrot'] },
  { result: 'turtle_master_potion', ingredients: ['awkward_potion', 'turtle_helmet'] },
  { result: 'slow_falling_potion', ingredients: ['awkward_potion', 'phantom_membrane'] },
  { result: 'wind_charging_potion', ingredients: ['awkward_potion', 'breeze_rod'] },
  { result: 'weaving_potion', ingredients: ['awkward_potion', 'web'] },
  { result: 'oozing_potion', ingredients: ['awkward_potion', 'slime'] },
  { result: 'infestation_potion', ingredients: ['awkward_potion', 'stone'] },
  { result: 'slowness_potion', ingredients: ['swiftness_potion', 'fermented_spider_eye'] },
  { result: 'slowness_potion', ingredients: ['jump_boost_potion', 'fermented_spider_eye'] },
  { result: 'harming_potion', ingredients: ['healing_potion', 'fermented_spider_eye'] },
  { result: 'harming_potion', ingredients: ['poison_potion', 'fermented_spider_eye'] },
  { result: 'invisibility_potion', ingredients: ['night_vision_potion', 'fermented_spider_eye'] },
  { result: 'swiftness_potion_potent', ingredients: ['swiftness_potion', 'glowstone_dust'] },
  { result: 'swiftness_potion_longer', ingredients: ['swiftness_potion', 'redstone'] },
  { result: 'slowness_potion_potent', ingredients: ['slowness_potion', 'glowstone_dust'] },
  { result: 'slowness_potion_longer', ingredients: ['slowness_potion', 'redstone'] },
  { result: 'jump_boost_potion_potent', ingredients: ['jump_boost_potion', 'glowstone_dust'] },
  { result: 'jump_boost_potion_longer', ingredients: ['jump_boost_potion', 'redstone'] },
  { result: 'strength_potion_potent', ingredients: ['strength_potion', 'glowstone_dust'] },
  { result: 'strength_potion_longer', ingredients: ['strength_potion', 'redstone'] },
  { result: 'healing_potion_potent', ingredients: ['healing_potion', 'glowstone_dust'] },
  { result: 'harming_potion_potent', ingredients: ['harming_potion', 'glowstone_dust'] },
  { result: 'poison_potion_potent', ingredients: ['poison_potion', 'glowstone_dust'] },
  { result: 'poison_potion_longer', ingredients: ['poison_potion', 'redstone'] },
  { result: 'regeneration_potion_potent', ingredients: ['regeneration_potion', 'glowstone_dust'] },
  { result: 'regeneration_potion_longer', ingredients: ['regeneration_potion', 'redstone'] },
  { result: 'fire_resistance_potion_longer', ingredients: ['fire_resistance_potion', 'redstone'] },
  { result: 'water_breathing_potion_longer', ingredients: ['water_breathing_potion', 'redstone'] },
  { result: 'night_vision_potion_longer', ingredients: ['night_vision_potion', 'redstone'] },
  { result: 'invisibility_potion_longer', ingredients: ['invisibility_potion', 'redstone'] },
  {
    result: 'turtle_master_potion_potent',
    ingredients: ['turtle_master_potion', 'glowstone_dust'],
  },
  { result: 'turtle_master_potion_longer', ingredients: ['turtle_master_potion', 'redstone'] },
  { result: 'slow_falling_potion_longer', ingredients: ['slow_falling_potion', 'redstone'] },
  { result: 'weakness_potion_longer', ingredients: ['weakness_potion', 'redstone'] },
  { result: 'splash_swiftness_potion', ingredients: ['swiftness_potion', 'gunpowder'] },
  {
    result: 'splash_swiftness_potion_potent',
    ingredients: ['swiftness_potion_potent', 'gunpowder'],
  },
  {
    result: 'splash_swiftness_potion_longer',
    ingredients: ['swiftness_potion_longer', 'gunpowder'],
  },
  { result: 'splash_slowness_potion', ingredients: ['slowness_potion', 'gunpowder'] },
  { result: 'splash_slowness_potion_potent', ingredients: ['slowness_potion_potent', 'gunpowder'] },
  { result: 'splash_slowness_potion_longer', ingredients: ['slowness_potion_longer', 'gunpowder'] },
  { result: 'splash_jump_boost_potion', ingredients: ['jump_boost_potion', 'gunpowder'] },
  {
    result: 'splash_jump_boost_potion_potent',
    ingredients: ['jump_boost_potion_potent', 'gunpowder'],
  },
  {
    result: 'splash_jump_boost_potion_longer',
    ingredients: ['jump_boost_potion_longer', 'gunpowder'],
  },
  { result: 'splash_strength_potion', ingredients: ['strength_potion', 'gunpowder'] },
  { result: 'splash_strength_potion_potent', ingredients: ['strength_potion_potent', 'gunpowder'] },
  { result: 'splash_strength_potion_longer', ingredients: ['strength_potion_longer', 'gunpowder'] },
  { result: 'splash_healing_potion', ingredients: ['healing_potion', 'gunpowder'] },
  { result: 'splash_healing_potion_potent', ingredients: ['healing_potion_potent', 'gunpowder'] },
  { result: 'splash_harming_potion', ingredients: ['harming_potion', 'gunpowder'] },
  { result: 'splash_harming_potion_potent', ingredients: ['harming_potion_potent', 'gunpowder'] },
  { result: 'splash_poison_potion', ingredients: ['poison_potion', 'gunpowder'] },
  { result: 'splash_poison_potion_potent', ingredients: ['poison_potion_potent', 'gunpowder'] },
  { result: 'splash_poison_potion_longer', ingredients: ['poison_potion_longer', 'gunpowder'] },
  { result: 'splash_regeneration_potion', ingredients: ['regeneration_potion', 'gunpowder'] },
  {
    result: 'splash_regeneration_potion_potent',
    ingredients: ['regeneration_potion_potent', 'gunpowder'],
  },
  {
    result: 'splash_regeneration_potion_longer',
    ingredients: ['regeneration_potion_longer', 'gunpowder'],
  },
  { result: 'splash_fire_resistance_potion', ingredients: ['fire_resistance_potion', 'gunpowder'] },
  {
    result: 'splash_fire_resistance_potion_longer',
    ingredients: ['fire_resistance_potion_longer', 'gunpowder'],
  },
  { result: 'splash_water_breathing_potion', ingredients: ['water_breathing_potion', 'gunpowder'] },
  {
    result: 'splash_water_breathing_potion_longer',
    ingredients: ['water_breathing_potion_longer', 'gunpowder'],
  },
  { result: 'splash_night_vision_potion', ingredients: ['night_vision_potion', 'gunpowder'] },
  {
    result: 'splash_night_vision_potion_longer',
    ingredients: ['night_vision_potion_longer', 'gunpowder'],
  },
  { result: 'splash_invisibility_potion', ingredients: ['invisibility_potion', 'gunpowder'] },
  {
    result: 'splash_invisibility_potion_longer',
    ingredients: ['invisibility_potion_longer', 'gunpowder'],
  },
  { result: 'splash_turtle_master_potion', ingredients: ['turtle_master_potion', 'gunpowder'] },
  {
    result: 'splash_turtle_master_potion_potent',
    ingredients: ['turtle_master_potion_potent', 'gunpowder'],
  },
  {
    result: 'splash_turtle_master_potion_longer',
    ingredients: ['turtle_master_potion_longer', 'gunpowder'],
  },
  { result: 'splash_slow_falling_potion', ingredients: ['slow_falling_potion', 'gunpowder'] },
  {
    result: 'splash_slow_falling_potion_longer',
    ingredients: ['slow_falling_potion_longer', 'gunpowder'],
  },
  { result: 'splash_weakness_potion', ingredients: ['weakness_potion', 'gunpowder'] },
  { result: 'splash_weakness_potion_longer', ingredients: ['weakness_potion_longer', 'gunpowder'] },
  { result: 'splash_wind_charging_potion', ingredients: ['wind_charging_potion', 'gunpowder'] },
  { result: 'splash_weaving_potion', ingredients: ['weaving_potion', 'gunpowder'] },
  { result: 'splash_oozing_potion', ingredients: ['oozing_potion', 'gunpowder'] },
  { result: 'splash_infestation_potion', ingredients: ['infestation_potion', 'gunpowder'] },
  {
    result: 'lingering_swiftness_potion',
    ingredients: ['splash_swiftness_potion', 'dragon_breath'],
  },
  {
    result: 'lingering_swiftness_potion',
    ingredients: ['splash_swiftness_potion', 'dragon_breath'],
  },
  {
    result: 'lingering_swiftness_potion_potent',
    ingredients: ['splash_swiftness_potion_potent', 'dragon_breath'],
  },
  {
    result: 'lingering_swiftness_potion_longer',
    ingredients: ['splash_swiftness_potion_longer', 'dragon_breath'],
  },
  { result: 'lingering_slowness_potion', ingredients: ['splash_slowness_potion', 'dragon_breath'] },
  {
    result: 'lingering_slowness_potion_potent',
    ingredients: ['splash_slowness_potion_potent', 'dragon_breath'],
  },
  {
    result: 'lingering_slowness_potion_longer',
    ingredients: ['splash_slowness_potion_longer', 'dragon_breath'],
  },
  {
    result: 'lingering_jump_boost_potion',
    ingredients: ['splash_jump_boost_potion', 'dragon_breath'],
  },
  {
    result: 'lingering_jump_boost_potion_potent',
    ingredients: ['splash_jump_boost_potion_potent', 'dragon_breath'],
  },
  {
    result: 'lingering_jump_boost_potion_longer',
    ingredients: ['splash_jump_boost_potion_longer', 'dragon_breath'],
  },
  { result: 'lingering_strength_potion', ingredients: ['splash_strength_potion', 'dragon_breath'] },
  {
    result: 'lingering_strength_potion_potent',
    ingredients: ['splash_strength_potion_potent', 'dragon_breath'],
  },
  {
    result: 'lingering_strength_potion_longer',
    ingredients: ['splash_strength_potion_longer', 'dragon_breath'],
  },
  { result: 'lingering_healing_potion', ingredients: ['splash_healing_potion', 'dragon_breath'] },
  {
    result: 'lingering_healing_potion_potent',
    ingredients: ['splash_healing_potion_potent', 'dragon_breath'],
  },
  { result: 'lingering_harming_potion', ingredients: ['splash_harming_potion', 'dragon_breath'] },
  {
    result: 'lingering_harming_potion_potent',
    ingredients: ['splash_harming_potion_potent', 'dragon_breath'],
  },
  { result: 'lingering_poison_potion', ingredients: ['splash_poison_potion', 'dragon_breath'] },
  {
    result: 'lingering_poison_potion_potent',
    ingredients: ['splash_poison_potion_potent', 'dragon_breath'],
  },
  { result: 'lingering_poison_potion', ingredients: ['splash_poison_potion', 'dragon_breath'] },
  {
    result: 'lingering_poison_potion_longer',
    ingredients: ['splash_poison_potion_longer', 'dragon_breath'],
  },
  {
    result: 'lingering_regeneration_potion',
    ingredients: ['splash_regeneration_potion', 'dragon_breath'],
  },
  {
    result: 'lingering_regeneration_potion_potent',
    ingredients: ['splash_regeneration_potion_potent', 'dragon_breath'],
  },
  {
    result: 'lingering_regeneration_potion_longer',
    ingredients: ['splash_regeneration_potion_longer', 'dragon_breath'],
  },
  {
    result: 'lingering_fire_resistance_potion',
    ingredients: ['splash_fire_resistance_potion', 'dragon_breath'],
  },
  {
    result: 'lingering_fire_resistance_potion_longer',
    ingredients: ['splash_fire_resistance_potion_longer', 'dragon_breath'],
  },
  {
    result: 'lingering_water_breathing_potion',
    ingredients: ['splash_water_breathing_potion', 'dragon_breath'],
  },
  {
    result: 'lingering_water_breathing_potion_longer',
    ingredients: ['splash_water_breathing_potion_longer', 'dragon_breath'],
  },
  {
    result: 'lingering_night_vision_potion',
    ingredients: ['splash_night_vision_potion', 'dragon_breath'],
  },
  {
    result: 'lingering_night_vision_potion_longer',
    ingredients: ['splash_night_vision_potion_longer', 'dragon_breath'],
  },
  {
    result: 'lingering_invisibility_potion',
    ingredients: ['splash_invisibility_potion', 'dragon_breath'],
  },
  {
    result: 'lingering_invisibility_potion_longer',
    ingredients: ['splash_invisibility_potion_longer', 'dragon_breath'],
  },
  {
    result: 'lingering_turtle_master_potion',
    ingredients: ['splash_turtle_master_potion', 'dragon_breath'],
  },
  {
    result: 'lingering_turtle_master_potion_potent',
    ingredients: ['splash_turtle_master_potion_potent', 'dragon_breath'],
  },
  {
    result: 'lingering_turtle_master_potion',
    ingredients: ['splash_turtle_master_potion', 'dragon_breath'],
  },
  {
    result: 'lingering_turtle_master_potion_longer',
    ingredients: ['splash_turtle_master_potion_longer', 'dragon_breath'],
  },
  {
    result: 'lingering_slow_falling_potion',
    ingredients: ['splash_slow_falling_potion', 'dragon_breath'],
  },
  {
    result: 'lingering_slow_falling_potion_longer',
    ingredients: ['splash_slow_falling_potion_longer', 'dragon_breath'],
  },
  { result: 'lingering_weakness_potion', ingredients: ['splash_weakness_potion', 'dragon_breath'] },
  {
    result: 'lingering_weakness_potion_longer',
    ingredients: ['splash_weakness_potion_longer', 'dragon_breath'],
  },
  {
    result: 'lingering_wind_charging_potion',
    ingredients: ['splash_wind_charging_potion', 'dragon_breath'],
  },
  { result: 'lingering_weaving_potion', ingredients: ['splash_weaving_potion', 'dragon_breath'] },
  { result: 'lingering_oozing_potion', ingredients: ['splash_oozing_potion', 'dragon_breath'] },
  {
    result: 'lingering_infestation_potion',
    ingredients: ['splash_infestation_potion', 'dragon_breath'],
  },
];
var aa = h.getLogger('FurniturePack', 'Interactive', 'Big Cauldron'),
  so = ['water_bucket', 'bucket', 'potion', 'glass_bottle'],
  fl = [...so, ...new Set(fn.flatMap((e) => e.ingredients).concat(fn.map((e) => e.result)))],
  kr = class {
    beforeOnPlayerPlace(r) {
      let { block: t, permutationToPlace: n } = r;
      ((this.db = new er(t)),
        pl.run(() => {
          this.db.entity({
            spawnAsNeeded: !0,
            entityToSpawn: 'xp_furniture:big_cauldron',
            direction: q.getBlockInFace(t, n.getState('minecraft:cardinal_direction'), 10)
              ?.location,
          });
        }),
        (r.permutationToPlace = n.withState('xp_furniture:is_placed', 1)));
    }
    onPlayerInteract(r) {
      let { block: t, player: n } = r;
      if (!n) return;
      this.db = new er(t);
      let o = this.db.entity({ spawnAsNeeded: !0, entityToSpawn: 'xp_furniture:big_cauldron' });
      if (!o) return;
      let i = W.getHeldItem(n);
      if (!i) return;
      let a = i.typeId.replace('minecraft:', '');
      if (!fl.includes(a)) return;
      let u = this.db.get('ingredients') ?? [],
        _ = o.getProperty('xp_furniture:has_already_brewed'),
        s = o.getProperty('xp_furniture:potion_fullness') ?? 0;
      if (a === 'glass_bottle' && _) {
        let c = u.find((p) => p.includes('potion'));
        if (c) {
          let p = c.includes('splash') ? 'splash_' : c.includes('lingering') ? 'lingering_' : '',
            w = ml[c.replace(/(lingering|splash)_/gm, '')];
          (n.runCommand(`give @s ${p}potion 1 ${w}`),
            W.decrementStack(n, 'minecraft:glass_bottle'),
            o.triggerEvent('xp_furniture:decrement_potion_fullness'),
            t.dimension.playSound('mob.witch.drink', t.location, { pitch: 0.9 }),
            t.dimension.playSound('bucket.empty_water', t.location, { volume: 0.75 }),
            (o.getProperty('xp_furniture:potion_fullness') ?? 0) < 1 &&
              (o.setProperty('xp_furniture:has_already_brewed', !1),
              t.setPermutation(t.permutation.withState('xp_furniture:has_potion', 0)),
              this.db.delete('ingredients')));
        }
        return;
      }
      if (so.includes(a) && !_) {
        let c = {
          'minecraft:water_bucket': 'increment_bucket_potion_fullness',
          'minecraft:bucket': 'decrement_bucket_potion_fullness',
          'minecraft:potion': 'increment_potion_fullness',
          'minecraft:glass_bottle': 'decrement_potion_fullness',
        };
        (o.triggerEvent(`xp_furniture:${c[i.typeId]}`),
          t.dimension.playSound(
            `bucket.${c[i.typeId].includes('increment') ? 'fill' : 'empty'}_water`,
            t.location,
          ));
        return;
      }
      if (s > 0 && !so.includes(a) && !u.includes(a)) {
        let c = [...u, a].sort(),
          p = fn.find((w) => {
            let C = [...w.ingredients].sort();
            return JSON.stringify(C) === JSON.stringify(c);
          });
        (W.decrementStack(n, i.typeId),
          p
            ? (this.db.set('ingredients', [p.result]),
              o.setProperty('xp_furniture:has_already_brewed', !0),
              t.setPermutation(t.permutation.withState('xp_furniture:has_potion', 1)),
              t.dimension.playSound('random.potion.brewed', t.location, {
                pitch: Math.withinRange(0.9, 1.1),
              }),
              aa.info(`Brewed ${p.result}. Ingredients used: ${p.ingredients.join(', ')}`))
            : (this.db.set('ingredients', c),
              aa.info(`Added ingredient: ${a}. Current ingredients: ${c.join(', ')}`)));
        return;
      }
    }
    onPlayerDestroy(r) {
      let t = this.db.entity();
      (t && t.triggerEvent('xp_furniture:despawn'), this.db.clear());
    }
  };
((kr.componentId = 'xp_furniture:big_cauldron'),
  d([m], kr.prototype, 'beforeOnPlayerPlace', 1),
  d([m], kr.prototype, 'onPlayerInteract', 1),
  d([m], kr.prototype, 'onPlayerDestroy', 1),
  (kr = d([x], kr)));
var ml = {
  awkward_potion: 4,
  fire_resistance_potion: 12,
  fire_resistance_potion_longer: 13,
  harming_potion: 23,
  harming_potion_potent: 24,
  healing_potion: 21,
  healing_potion_potent: 22,
  infestation_potion: 46,
  invisibility_potion: 7,
  invisibility_potion_longer: 8,
  jump_boost_potion: 9,
  jump_boost_potion_longer: 10,
  jump_boost_potion_potent: 11,
  mundane_potion: 1,
  night_vision_potion: 5,
  night_vision_potion_longer: 6,
  oozing_potion: 45,
  poison_potion: 25,
  poison_potion_longer: 26,
  poison_potion_potent: 27,
  regeneration_potion: 28,
  regeneration_potion_longer: 29,
  regeneration_potion_potent: 30,
  slow_falling_potion: 40,
  slow_falling_potion_longer: 41,
  slowness_potion: 17,
  slowness_potion_longer: 18,
  slowness_potion_potent: 42,
  strength_potion: 31,
  strength_potion_longer: 32,
  strength_potion_potent: 33,
  swiftness_potion: 14,
  swiftness_potion_longer: 15,
  swiftness_potion_potent: 16,
  thick_potion: 3,
  turtle_master_potion: 37,
  turtle_master_potion_longer: 38,
  turtle_master_potion_potent: 39,
  water_breathing_potion: 19,
  water_breathing_potion_longer: 20,
  weakness_potion: 34,
  weakness_potion_longer: 35,
  weaving_potion: 44,
  wind_charging_potion: 43,
};
var pt = class {
  beforeOnPlayerPlace(r) {
    let { block: t } = r;
    q.isReplaceableBlock(t.above()) || (r.cancel = !0);
  }
};
((pt.componentId = 'xp_furniture:block_and_half_placement'),
  d([m], pt.prototype, 'beforeOnPlayerPlace', 1),
  (pt = d([x], pt)));
import { system as gl, TicksPerSecond as hl } from '@minecraft/server';
var Gr = class {
  constructor() {
    this.log = h.getLogger('FurniturePack', 'Interactive', 'Camera');
  }
  onPlayerInteract(r) {
    let { block: t, dimension: n } = r,
      o = t.permutation.getState('minecraft:cardinal_direction'),
      i = n.getEntitiesAtBlockLocation(t.location);
    for (let u of i) if (u.typeId === 'xp_furniture:standing_camera') return;
    let a = q.summonAuxiliaryEntity(t, 'xp_furniture:standing_camera', {
      spawnEvent: 'xp_furniture:is_uninteractable',
      targetRotation: q.getBlockInFace(t, o, 10)?.location,
      centerBlock: !0,
    });
    gl.runTimeout(() => {
      if (!a || !a.isValid) return;
      t.dimension.getEntitiesAtBlockLocation(t.location).forEach((c) => {
        c.typeId === 'xp_furniture:standing_camera' && c.triggerEvent('xp_furniture:despawn');
      });
      let u = {
          north: { x: 0, y: 0, z: -0.25 },
          south: { x: 0, y: 0, z: 0.25 },
          east: { x: 0.25, y: 0, z: 0 },
          west: { x: -0.25, y: 0, z: 0 },
        },
        _ = [t.center().x + u[o].x, t.center().y + u[o].y + 0.75, t.center().z + u[o].z],
        s = T.getSeason();
      (t.dimension.runCommand(
        `loot spawn ${_.join(' ')} loot "xp/fpack/entities/func/polaroid_${s}.lt"`,
      ),
        t.dimension.playSound('random.pop', t.location, { pitch: Math.withinRange(0.9, 1.25) }),
        this.log.info(`Spawned polaroid item at ${_.join(', ')}`));
    }, hl * 5);
  }
  onPlayerBreak(r) {
    let { block: t } = r;
    t.dimension.getEntitiesAtBlockLocation(t.location).forEach((n) => {
      n.typeId === 'xp_furniture:standing_camera' && n.triggerEvent('xp_furniture:despawn');
    });
  }
};
((Gr.componentId = 'xp_furniture:camera'),
  d([m], Gr.prototype, 'onPlayerInteract', 1),
  d([m], Gr.prototype, 'onPlayerBreak', 1),
  (Gr = d([x], Gr)));
import {
  EntityVariantComponent as bl,
  EquipmentSlot as xl,
  ItemStack as wl,
} from '@minecraft/server';
var co = ['minecraft:egg', 'minecraft:brown_egg', 'minecraft:blue_egg'];
function ua(e) {
  let r = e.getComponent(bl.componentId);
  return r.isValid ? r.value : 0;
}
function kl(e) {
  return co.indexOf(e);
}
var Ee = class {
  constructor() {
    this.log = h.getLogger('ChickenNest');
  }
  onPlayerInteract(r) {
    let { block: t, dimension: n, player: o } = r,
      i = t.center();
    if (!o) return;
    let a = D.getEntityFromBlock(t);
    if (!a) return;
    let u = y.getEquippableComponent(o)?.getEquipment(xl.Mainhand),
      _ = a.getProperty('xp_furniture:is_interacted_with');
    if (_) {
      (a.setProperty('xp_furniture:is_interacted_with', !1),
        a.setDynamicProperty('xp_furniture:wait_timer'));
      let c = ua(a),
        p = co[c];
      (n.spawnItem(new wl(p, 1), i), this.log.debug('Egg removed. Reset timer'));
      return;
    }
    let s = u?.typeId;
    if (!_ && s && co.includes(s)) {
      let c = Math.integerWithinRange(Ee.EGG_HATCH_TIME_SECONDS_MIN, Ee.EGG_HATCH_TIME_SECONDS_MAX);
      (a.setProperty('xp_furniture:is_interacted_with', !0),
        a.setDynamicProperty('xp_furniture:wait_timer', c));
      let p = kl(s);
      (p === 0
        ? a.triggerEvent('xp_furniture:set_egg_temperate')
        : p === 1
          ? a.triggerEvent('xp_furniture:set_egg_warm')
          : p === 2 && a.triggerEvent('xp_furniture:set_egg_cold'),
        n.playSound('random.pop', i),
        this.log.debug(`Egg added. Count down: ${c}s`),
        W.decrementStack(o, s, !0));
    }
  }
  onTick(r) {
    let { block: t, dimension: n } = r,
      o = t.center(),
      i = D.getEntityFromBlock(t);
    if (!i || !i.getProperty('xp_furniture:is_interacted_with')) return;
    let u = i.getDynamicProperty('xp_furniture:wait_timer');
    if (typeof u != 'number') return;
    if (u > 0) {
      ((u -= 1), i.setDynamicProperty('xp_furniture:wait_timer', u));
      let c = f
        .from(o)
        .add(Math.withinRange(-0.3, 0.3), Math.withinRange(-0.3, 0.3), Math.withinRange(-0.3, 0.3));
      n.spawnParticle('minecraft:villager_happy', c);
      return;
    }
    (i.setProperty('xp_furniture:is_interacted_with', !1),
      i.setDynamicProperty('xp_furniture:wait_timer'));
    let _ = n.spawnEntity('minecraft:chicken', o, { spawnEvent: 'minecraft:entity_born' }),
      s = ua(i);
    (s === 1
      ? _.triggerEvent('minecraft:hatch_warm')
      : s === 2 && _.triggerEvent('minecraft:hatch_cold'),
      n.playSound('mob.chicken.plop', o),
      this.log.debug('Egg hatched!'));
  }
};
((Ee.componentId = 'xp_furniture:chicken_nest'),
  (Ee.EGG_HATCH_TIME_SECONDS_MIN = 150),
  (Ee.EGG_HATCH_TIME_SECONDS_MAX = 300),
  d([m], Ee.prototype, 'onPlayerInteract', 1),
  d([m], Ee.prototype, 'onTick', 1),
  (Ee = d([x], Ee)));
import { ItemStack as Sl, system as _a, TicksPerSecond as Cl } from '@minecraft/server';
var Rt = {
  cook_items: [
    { item: 'minecraft:potato', cooked: 'minecraft:baked_potato', duration: 10 },
    { item: 'minecraft:beef', cooked: 'minecraft:cooked_beef', duration: 15 },
    { item: 'minecraft:chicken', cooked: 'minecraft:cooked_chicken', duration: 12 },
    { item: 'minecraft:cod', cooked: 'minecraft:cooked_cod', duration: 8 },
    { item: 'minecraft:kelp', cooked: 'minecraft:dried_kelp', duration: 5 },
    { item: 'minecraft:mutton', cooked: 'minecraft:cooked_mutton', duration: 14 },
    { item: 'minecraft:porkchop', cooked: 'minecraft:cooked_porkchop', duration: 15 },
    { item: 'minecraft:rabbit', cooked: 'minecraft:cooked_rabbit', duration: 10 },
    { item: 'minecraft:salmon', cooked: 'minecraft:cooked_salmon', duration: 8 },
    { item: 'xp_furniture:eggplant', cooked: 'xp_furniture:grilled_eggplant', duration: 8 },
    { item: 'xp_furniture:corn', cooked: 'xp_furniture:grilled_corn', duration: 8 },
  ],
  fuel_items: [
    { value: 1e3, items: ['minecraft:lava_bucket'] },
    { value: 800, items: ['minecraft:coal_block'] },
    { value: 200, items: ['minecraft:dried_kelp_block'] },
    { value: 120, items: ['minecraft:blaze_rod'] },
    { value: 80, items: ['minecraft:coal', 'minecraft:charcoal'] },
    { value: 60, items: ['minecraft:boat', 'minecraft:chest_boat'] },
    {
      value: 15,
      items: [
        'minecraft:bamboo_mosaic',
        'minecraft:bamboo_mosaic_slab',
        'minecraft:bamboo_mosaic_stairs',
        'minecraft:bee_nest',
        'minecraft:beehive',
        'minecraft:chiseled_bookshelf',
        'minecraft:bamboo_block',
        'minecraft:log',
        'minecraft:mangrove_log',
        'minecraft:cherry_log',
        'minecraft:crimson_stem',
        'minecraft:warped_stem',
        'minecraft:wood',
        'minecraft:mangrove_wood',
        'minecraft:cherry_wood',
        'minecraft:warped_hyphae',
        'minecraft:planks',
        'minecraft:mangrove_planks',
        'minecraft:cherry_planks',
        'minecraft:bamboo_planks',
        'minecraft:crimson_hyphae',
        'minecraft:crimson_planks',
        'minecraft:warped_planks',
        'minecraft:wooden_slab',
        'minecraft:mangrove_slab',
        'minecraft:cherry_slab',
        'minecraft:mangrove_slab',
        'minecraft:bamboo_slab',
        'minecraft:crimson_slab',
        'minecraft:warped_slab',
        'minecraft:oak_stairs',
        'minecraft:spruce_stairs',
        'minecraft:birch_stairs',
        'minecraft:jungle_stairs',
        'minecraft:acacia_stairs',
        'minecraft:dark_oak_stairs',
        'minecraft:mangrove_stairs',
        'minecraft:cherry_stairs',
        'minecraft:bamboo_stairs',
        'minecraft:crimson_stairs',
        'minecraft:warped_stairs',
        'minecraft:oak_stairs',
        'minecraft:spruce_stairs',
        'minecraft:birch_stairs',
        'minecraft:jungle_stairs',
        'minecraft:acacia_stairs',
        'minecraft:dark_oak_stairs',
        'minecraft:mangrove_stairs',
        'minecraft:cherry_stairs',
        'minecraft:bamboo_stairs',
        'minecraft:crimson_stairs',
        'minecraft:warped_stairs',
      ],
    },
    {
      value: 5,
      items: [
        'minecraft:sapling',
        'minecraft:cherry_sapling',
        'minecraft:stick',
        'minecraft:deadbush',
      ],
    },
  ],
};
var la = h.getLogger('FurniturePack', 'Interactive', 'Cooking Pan'),
  sa = Rt.cook_items,
  ne = class {
    static getExistingCookingPan(r) {
      return r.dimension.getEntities({
        type: 'xp_furniture:cooking_pan',
        location: r.center(),
        maxDistance: 1,
        closest: 1,
      })[0];
    }
    static dropCookingPanItem(r, t) {
      r.dimension.spawnItem(
        new Sl(
          t
            .getTags()
            .find((n) => n.startsWith('xp_cpan_'))
            ?.replace('xp_cpan_', ''),
          1,
        ),
        f.from(r.center()).add({ x: 0, y: -0.6, z: 0 }),
      );
    }
    static removeCookingPanEntity(r) {
      let t = this.getExistingCookingPan(r);
      return t
        ? (this.dropCookingPanItem(r, t),
          t.triggerEvent('xp_furniture:instant_despawn'),
          r.isAir ||
            (r.setPermutation(r.permutation.withState('xp_furniture:inv', 0)),
            r.dimension.playSound('random.pop', r.center())),
          !0)
        : !1;
    }
    onPlayerInteract(r) {
      let { block: t, player: n } = r;
      if (!n || n.isSneaking) return;
      let o = ne.getExistingCookingPan(t);
      if (!o) {
        this.addCookingItem(t, W.getHeldItem(n), n);
        return;
      }
      let i = o
        .getTags()
        .find((a) => a.startsWith('xp_cpan_'))
        ?.replace('xp_cpan_', '');
      sa.some((a) => a.cooked === i)
        ? ne.removeCookingPanEntity(t)
        : t.below()?.permutation.getState('xp_furniture:lit') === 1 &&
          (o.triggerEvent('xp_furniture:flip_item'),
          t.dimension.playSound('xp_furniture:cook.flip', t.center()));
    }
    onPlayerBreak(r) {
      let { block: t } = r;
      ne.removeCookingPanEntity(t);
    }
    addCookingItem(r, t, n) {
      if (r.typeId !== 'xp_furniture:cooking_pan' || !t) return;
      let o = sa.find((i) => i.item === t.typeId);
      o === void 0 ||
        n.isSneaking ||
        (la.info(
          'Cooking Pan interaction:',
          n.name,
          t.typeId,
          r.below()?.permutation.getState('xp_furniture:lit'),
        ),
        _a.run(() => {
          if (ne.removeCookingPanEntity(r)) return;
          let i = r.permutation.getAllStates();
          ((i['xp_furniture:inv'] = 1), r.setPermutation(Q(r.typeId, i)));
          let a = i['minecraft:cardinal_direction'];
          a === 'north' ? (a = 'south') : a === 'south' && (a = 'north');
          let u = q.summonAuxiliaryEntity(r, 'xp_furniture:cooking_pan', {
            spawnEvent: `xp_furniture:set_init_rotation.${a}`,
            spawnOffset: { x: 0, y: 0, z: 0 },
            centerBlock: !0,
          });
          if (
            (u.runCommand(`replaceitem entity @s slot.weapon.mainhand 0 ${t.typeId} 1`),
            u.addTag(`xp_cpan_${t.typeId}`),
            W.decrementStack(n, t),
            r.below()?.permutation.getState('xp_furniture:lit') !== 1)
          )
            return;
          u.setProperty('xp_furniture:is_cooking', !0);
          let _ = _a.runTimeout(() => {
            try {
              u.runCommand(`replaceitem entity @s slot.weapon.mainhand 0 ${o.cooked} 1`);
            } catch (s) {
              la.warn('Failed to run function. (Most likely due to entity despawn)', u, s);
              return;
            }
            (u.addTag(`xp_cpan_${o.cooked}`),
              u.removeTag(`xp_cpan_${t.typeId}`),
              r.dimension.playSound('random.orb', r.center()),
              u.setProperty('xp_furniture:is_cooking', !1));
          }, Cl * o.duration);
          u.setDynamicProperty('xp_furniture:cooking_pan_runtime', _);
        }));
    }
  };
((ne.componentId = 'xp_furniture:cooking_pan'),
  d([m], ne.prototype, 'onPlayerInteract', 1),
  d([m], ne.prototype, 'onPlayerBreak', 1),
  (ne = d([x], ne)));
import { EquipmentSlot as da, GameMode as yl } from '@minecraft/server';
var se = class {
  onRandomTick(r, t) {
    let { block: n } = r,
      { params: o } = t,
      i = o;
    if (!i) return;
    let a = i.min_light_level;
    if (n.getLightLevel() < a) return;
    let _ = i.growth_chance / 100;
    Math.random() > _ || se.growCrop(n, 1, !1);
  }
  onPlayerInteract(r, t) {
    let { block: n, player: o, dimension: i } = r;
    if (!o) return;
    let { params: a } = t,
      u = a;
    if (!u) return;
    let _ = u.growth_state,
      s = u.max_growth,
      c = y.getEquippableComponent(o);
    if (!c) return;
    let p = c.getEquipment(da.Mainhand);
    if (!p || p.typeId !== 'minecraft:bone_meal') return;
    let w = n.permutation.getState(_) ?? 0;
    if (o.getGameMode() === yl.Creative) {
      let C = s - w;
      se.growCrop(n, C);
    } else {
      let C = Math.integerWithinRange(1, s - w);
      (se.growCrop(n, C), p.amount > 1 ? p.amount-- : c.setEquipment(da.Mainhand, void 0));
    }
    i.playSound('item.bone_meal.use', n.center());
  }
  static growCrop(r, t = 1, n = 'minecraft:crop_growth_emitter') {
    let { dimension: o, permutation: i } = r,
      a = i.getAllStates(),
      u = f.from(r.location),
      _ = (s) => {
        n !== !1 && o.spawnParticle(n, u.add({ x: 0.5, y: s, z: 0.5 }));
      };
    if ('xp_furniture:growth_stage' in a) {
      let s = a['xp_furniture:growth_stage'] ?? 0,
        c = Math.min(s + t, 3),
        p = () => {
          (r.setPermutation(i.withState('xp_furniture:growth_stage', c)), _(0.25));
        },
        w = r.above();
      if ('xp_furniture:head_piece_bit' in a && w && w.isAir && c === 3) {
        (p(),
          o.setBlockPermutation(u.up(), i.withState('xp_furniture:head_piece_bit', 1)),
          _(1.25));
        return;
      }
      p();
      return;
    }
    try {
      let s = a.growth ?? 0;
      (r.setPermutation(i.withState('growth', Math.min(s + t, 7))), _(0.25));
    } catch {}
  }
};
((se.componentId = 'xp_furniture:custom_crops'),
  d([m], se.prototype, 'onRandomTick', 1),
  d([m], se.prototype, 'onPlayerInteract', 1),
  (se = d([x], se)));
import {
  EntityEquippableComponent as Pl,
  EntityInventoryComponent as El,
  EquipmentSlot as Dl,
  system as Bl,
} from '@minecraft/server';
var ca = 'xp_furniture:display_case',
  po = 'xp_furniture:version',
  Ft = h.getLogger('DisplayCase', 'Blocks', 'Func'),
  $r = class extends D {
    beforeOnPlayerPlace(r, t) {
      let n = t.params,
        { permutationToPlace: o, block: i, dimension: a } = r,
        u = o.getAllStates(),
        _ = u['minecraft:block_face'] === 'up' || u['minecraft:block_face'] === 'down',
        s;
      _ ? (s = u['minecraft:cardinal_direction']) : (s = u['minecraft:block_face']);
      let w = _
          ? { north: [0, 0], east: [0, 90], south: [0, 180], west: [0, -90] }[s]
          : { north: [0, 180], east: [0, -90], south: [0, 0], west: [0, 90] }[s],
        C = f.from(i.bottomCenter()),
        P = i.location,
        O = a.getBlock(P);
      if (!O) {
        D.log.error(`Block not found after placement at ${P}`);
        return;
      }
      let F = ['xp_furniture:', _ ? 'floor' : 'wall', '_', n.type].join('');
      Bl.run(() => {
        let B = ['summon', 'xp_furniture:display_case', C.toString('short', ' '), w[1], w[0], F];
        a.runCommand(B.join(' '));
        let A = a.getEntities({
          type: 'xp_furniture:display_case',
          location: C,
          closest: 1,
          maxDistance: 1,
        })?.[0];
        if (!A) D.log.error('Failed to spawn entity "xp_furniture:display_case"');
        else {
          A.setDynamicProperty(po, 1);
          let $ = this.calculateMultiblockPositions(O, Fe.FromString[s]);
          (this.storeBlocksOnEntity(A, $),
            D.log.info(
              `Spawned: ${A.typeId}, rot: [${w[0]}, ${w[1]}], event: ${F}, for: ${O.typeId}`,
            ));
        }
      });
    }
  };
(($r.componentId = 'xp_furniture:display_case'),
  d([m], $r.prototype, 'beforeOnPlayerPlace', 1),
  ($r = d([x], $r)));
var ft = class ft {
  constructor(r) {
    ((this.entity = r), (this.version = r.getDynamicProperty(po) ?? 0));
  }
  static handleInteractionEvent(r) {
    let { target: t } = r;
    if (t.typeId !== ca || !t.isValid) return;
    let { player: n, itemStack: o, beforeItemStack: i } = r;
    new ft(t).interactedWith(n, o, i);
  }
  static handleEntityHitEntityEvent(r) {
    let { damagingEntity: t, hitEntity: n } = r;
    if (t.typeId !== 'minecraft:player' || n.typeId !== ca) return;
    new ft(n).hit();
  }
  interactedWithVersion0(r, t, n) {
    (Ft.info('Legacy (v0) display case interacted with. Will upgrade on successful take action'),
      !(n !== void 0) &&
        t !== void 0 &&
        (this.entity.triggerEvent('xp_furniture:set_version_1'),
        (this.version = 1),
        this.entity.setDynamicProperty(po, 1),
        Ft.info('Upgraded display case to version 1')));
  }
  isOpen() {
    return this.entity.getProperty('xp_furniture:is_interacted_with');
  }
  setOpen(r) {
    this.entity.setProperty('xp_furniture:is_interacted_with', r);
  }
  getContainer() {
    if (this.container === void 0) {
      let r = this.entity.getComponent(El.componentId);
      if (!r.isValid) return;
      let t = r.container;
      if (!t.isValid) return;
      this.container = t;
    }
    return this.container;
  }
  clearContents() {
    let r = this.getContainer();
    r && (r.setItem(0), this.entity.runCommand('replaceitem entity @s slot.weapon.mainhand 0 air'));
  }
  hit() {
    if (!this.isOpen()) return;
    let r = this.getContainer();
    if (!r) return;
    let t = r.getItem(0);
    t && (this.clearContents(), this.entity.dimension.spawnItem(t, this.entity.location));
  }
  interactedWith(r, t, n) {
    if (this.version === 0) {
      this.interactedWithVersion0(r, t, n);
      return;
    }
    if (this.isOpen()) {
      let o = n !== void 0,
        i = t !== void 0,
        a = o && !i,
        u = this.getContainer();
      if (!u) return;
      let _ = u.getItem(0);
      if (
        (o &&
          i &&
          !a &&
          !_ &&
          ((a = n.amount == t.amount + 1),
          Ft.info(`Stack interaction detected. didGiveItem corrected to: ${a}`)),
        a && n)
      ) {
        Ft.info('Player gave item to display case');
        let s = n.clone();
        ((s.amount = 1), u.setItem(0, s));
      } else if (!o && _ && r.isSneaking) {
        (Ft.info('Player taking item from display case'),
          u.setItem(0),
          this.entity.runCommand('replaceitem entity @s slot.weapon.mainhand 0 air'));
        let s = r.getComponent(Pl.componentId);
        s.isValid && s.setEquipment(Dl.Mainhand, _);
      } else this.setOpen(!1);
    } else this.setOpen(!0);
  }
};
(d([ti], ft, 'handleInteractionEvent', 1), d([Et], ft, 'handleEntityHitEntityEvent', 1));
var pa = ft;
import { GameMode as Al, ItemStack as Wl } from '@minecraft/server';
var Oe = class {
  onPlayerInteract(r) {
    let { block: t, player: n, dimension: o } = r;
    if (!n) return;
    let i = W.getHeldItem(n),
      a = this.getCookieCount(t);
    if (i) {
      if (i.matches(E.Cookie) || i.matches('xp_furniture:cookie')) {
        if (a === Oe.maxCookieCount) return;
        (this.setCookieCount(t, a + 1), n.getGameMode() === Al.Survival && W.decrementStack(n, i));
      }
    } else {
      if (a === 0) return;
      (this.setCookieCount(t, a - 1),
        o.spawnItem(new Wl(E.Cookie), t.location),
        o.playSound('random.pop', t.location));
    }
    o.playSound('random.pop', t.location);
  }
  getCookieCount(r) {
    return r.permutation.getState(Oe.cookiesCountState);
  }
  setCookieCount(r, t) {
    r.setPermutation(r.permutation.withState(Oe.cookiesCountState, t));
  }
};
((Oe.componentId = 'xp_furniture:glass_jar'),
  (Oe.cookiesCountState = 'xp_furniture:cookies_count'),
  (Oe.maxCookieCount = 5),
  d([m], Oe.prototype, 'onPlayerInteract', 1),
  (Oe = d([x], Oe)));
import {
  BlockPermutation as Ol,
  Direction as Ll,
  EquipmentSlot as ql,
  GameMode as fa,
  ItemComponentTypes as zl,
  system as Rl,
} from '@minecraft/server';
var Fl = h.getLogger('HangingFlowerPot'),
  oe = class {
    beforeOnPlayerPlace(r) {
      let { player: t, block: n, permutationToPlace: o, face: i } = r;
      if (!t) return;
      let a = n.below(),
        u = n;
      i != Ll.Down && ((a = n), (u = n.above(1)));
      let _ = [a, u];
      if (!this.isPlaceable(_) || !a || !u) {
        (Fl.info('Placement Cancel due - Room not enough.'), (r.cancel = !0));
        return;
      }
      let s = o.getAllStates();
      (Rl.run(() => {
        _.forEach((c) => {
          ((s[oe.TopBitPiece] = _.indexOf(c)), c.setPermutation(Ol.resolve(o.type.id, s)));
        });
      }),
        W.decrementStack(t, o.type.id),
        (r.permutationToPlace = n.permutation));
    }
    onPlace(r) {
      let { block: t, dimension: n } = r,
        o = f.from(t.location),
        i = n.getBlock(o.up());
      !i ||
        i.type.id != 'xp_furniture:rope' ||
        i.setPermutation(i.permutation.withState(oe.RopeDown, !0));
    }
    onPlayerBreak(r) {
      let { brokenBlockPermutation: t, dimension: n, player: o } = r;
      if (
        !o ||
        y
          .getEquippableComponent(o)
          ?.getEquipment(ql.Mainhand)
          ?.getComponent(zl.Enchantable)
          ?.hasEnchantment(Dr.SilkTouch)
      )
        return;
      let u = o.getGameMode();
      if (u && u !== fa.Creative && u !== fa.Spectator) {
        let _ = t.getItemStack();
        _ && n.spawnItem(_, f.from(r.block.location));
      }
    }
    onBreak(r) {
      let { block: t, brokenBlockPermutation: n, dimension: o } = r,
        i = n.getState(oe.TopBitPiece) === 0,
        a = f.from(t).up();
      if (!i) return;
      o.runCommand(`setblock ${a.toString('short', ' ')} air destroy`);
      let u = o.getBlock(a.up());
      !u ||
        u.type.id != 'xp_furniture:rope' ||
        u.setPermutation(u.permutation.withState(oe.RopeDown, !1));
    }
    isPlaceable(r) {
      for (let t of r) if (!t || !ur.includes(t.typeId)) return !1;
      return !0;
    }
  };
((oe.componentId = 'xp_furniture:hanging_flower_pot'),
  (oe.TopBitPiece = 'xp_furniture:top_piece_bit'),
  (oe.RopeDown = 'xp_furniture:down'),
  d([m], oe.prototype, 'beforeOnPlayerPlace', 1),
  d([m], oe.prototype, 'onPlace', 1),
  d([m], oe.prototype, 'onPlayerBreak', 1),
  d([m], oe.prototype, 'onBreak', 1),
  (oe = d([x], oe)));
import { BlockPermutation as ma } from '@minecraft/server';
var Nr = class {
  onPlayerInteract(r) {
    let { block: t } = r;
    if (t.permutation.getState('xp_furniture:carvings') === void 0) return;
    let n = t.permutation.getState('xp_furniture:carvings');
    (t.setPermutation(
      ma.resolve(t.typeId, {
        ...t.permutation.getAllStates(),
        'xp_furniture:is_placed': 1,
        'xp_furniture:carvings': n >= 6 ? 0 : n + 1,
      }),
    ),
      t.dimension.playSound('block.click', t.center(), { pitch: 0.7 }));
  }
  beforeOnPlayerPlace(r) {
    let { block: t, player: n } = r,
      o = r.permutationToPlace;
    if (o.getState('minecraft:block_face') !== 'down') return;
    let i = t.above() || !1,
      a = 0;
    if (i) {
      let _ = i.typeId,
        s = i.permutation;
      if (_.includes('hanging_item_sign_v2')) a = s.getState('xp_furniture:direction');
      else if (_.includes('hanging_sign')) {
        let c = s.getState('attached_bit'),
          p = s.getState('facing_direction'),
          w = s.getState('ground_sign_direction');
        c
          ? [0, 4, 8, 12].includes(w)
            ? (a = { 0: 0, 4: 1, 8: 2, 12: 3 }[w])
            : (a = 'cancel')
          : (a = { 2: 0, 3: 2, 4: 3, 5: 1 }[p]);
      } else n && (a = y.getPlayerCardinalDirection(n));
    }
    let u =
      i &&
      ((i.permutation.getState('xp_furniture:is_attached_to_landmark_sign') === 0 &&
        i.permutation.getState('minecraft:block_face') !== 'down') ||
        (i.permutation.getState('xp_furniture:is_attached_to_landmark_sign') === 1 &&
          i.permutation.getState('minecraft:block_face') === 'down'));
    a === 'cancel'
      ? (r.cancel = !0)
      : (r.permutationToPlace = ma.resolve(o.type.id, {
          'minecraft:block_face': 'down',
          'xp_furniture:is_placed': 1,
          'xp_furniture:direction': a,
          'xp_furniture:is_attached_to_landmark_sign': u ? 1 : 0,
          'xp_furniture:carvings': 0,
        }));
  }
};
((Nr.componentId = 'xp_furniture:hanging_landmark_sign'),
  d([m], Nr.prototype, 'onPlayerInteract', 1),
  d([m], Nr.prototype, 'beforeOnPlayerPlace', 1),
  (Nr = d([x], Nr)));
import {
  EntityRideableComponent as Gl,
  system as ga,
  TicksPerSecond as ha,
  world as $l,
} from '@minecraft/server';
var ba = new Map(),
  Nl = h.getLogger('Pillow Component'),
  De = class {
    onPlayerInteract(r) {
      let { block: t, dimension: n, player: o } = r;
      if (!o || t.permutation.getState(De.isOccupiedState) == 1) return;
      let i = t.typeId.split(':')[1].replace('_wood_pillow', '');
      Nl.info(`Color: ${i}`);
      let a = n.spawnEntity('xp_furniture:wood_pillow', t.bottomCenter());
      (a.triggerEvent(`xp_furniture:color_${i}`),
        a.getComponent(Gl.componentId).addRider(o),
        t.setPermutation(t.permutation.withState(De.isOccupiedState, !0)),
        ba.set(a.id, {
          dimension: t.dimension,
          location: { x: t.location.x, y: t.location.y, z: t.location.z },
          typeId: t.typeId,
        }));
    }
    static onEntityLoad(r) {
      let t = r.entity,
        n = 'xp_furniture:wood_pillow';
      if (t.typeId != n) return;
      let { dimension: o, location: i } = t,
        a = o.getBlock(i);
      function u() {
        !a ||
          a.type.id == n ||
          (t.triggerEvent('xp_furniture:despawn'),
          a.setPermutation(a.permutation.withState(De.isOccupiedState, !1)));
      }
      ga.runTimeout(() => u(), ha);
    }
  };
((De.componentId = 'xp_furniture:pillow'),
  (De.isOccupiedState = 'xp_furniture:is_occupied'),
  d([m], De.prototype, 'onPlayerInteract', 1),
  d([Zr], De, 'onEntityLoad', 1),
  (De = d([x], De)));
function releasePillow(e) {
  if (!e) return;
  let r = e.dimension.getBlock(e.location);
  !r || r.typeId !== e.typeId || r.setPermutation(r.permutation.withState(De.isOccupiedState, !1));
}
$l.afterEvents.dataDrivenEntityTrigger.subscribe(
  (e) => {
    let { entity: r } = e,
      t = ba.get(r.id);
    ba.delete(r.id);
    ga.runTimeout(() => {
      (releasePillow(t), r?.isValid && r.triggerEvent('xp_furniture:despawn'));
    }, ha * 1.5);
  },
  { entityTypes: ['xp_furniture:wood_pillow'], eventTypes: ['xp_furniture:exit'] },
);
$l.afterEvents.entityRemove.subscribe((e) => {
  let r = ba.get(e.removedEntityId);
  (ba.delete(e.removedEntityId), r && ga.run(() => releasePillow(r)));
});
import { EntityComponentTypes as Hl } from '@minecraft/server';
var rr = class {
  constructor() {
    this.log = h.getLogger('RockingChair');
  }
  onPlayerInteract(r) {
    let { block: t, player: n } = r;
    if (!n) return;
    let o = D.getEntityFromBlock(t, { entityTypeId: rr.componentId });
    if (!o) return;
    this.log.debug('entity:', o.isValid);
    let i = o.getComponent(Hl.Rideable);
    !i || i.getRiders().length > 0 || (this.log.debug('rideable:', i.isValid), i.addRider(n));
  }
};
((rr.componentId = 'xp_furniture:rocking_chair'),
  d([m], rr.prototype, 'onPlayerInteract', 1),
  (rr = d([x], rr)));
import {
  ButtonState as xa,
  InputButton as Ql,
  InputPermissionCategory as wa,
  system as ka,
} from '@minecraft/server';
Vo.installPlayer();
var iC = h.getLogger('RopeClimbing'),
  mt = new Map(),
  fo = 2,
  ropeJumpLockProperty = 'xp_furniture:rope_jump_locked';
function va(e) {
  return (
    e.matches('xp_furniture:rope', { 'xp_furniture:up': !0 }) ||
    e.matches('xp_furniture:rope', { 'xp_furniture:down': !0 })
  );
}
ka.runInterval(() => {
  for (let e of y.getAllPlayers()) {
    if (!e.isValid) {
      mt.delete(e.id);
      continue;
    }
    let t = e.dimension.getBlock(e.location);
    if (!t || !va(t)) {
      (mt.has(e.id) || e.getDynamicProperty(ropeJumpLockProperty) === !0) &&
        (mt.delete(e.id),
        e.inputPermissions.setPermissionCategory(wa.Jump, !0),
        e.setDynamicProperty(ropeJumpLockProperty, void 0));
      continue;
    }
    (mt.has(e.id) ||
      (mt.set(e.id, { player: e, ticksSinceLastReleased: 0 }),
      e.setDynamicProperty(ropeJumpLockProperty, !0)),
      e.inputPermissions.setPermissionCategory(wa.Jump, !1));
  }
}, 8);
ka.runInterval(() => {
  for (let [e, r] of mt) {
    let { player: t, ticksSinceLastReleased: n } = r,
      o;
    if (!t.isValid) {
      mt.delete(e);
      continue;
    }
    o = t.dimension;
    let i = t.inputInfo.getButtonState(Ql.Jump),
      a = o.getBlock(t.location);
    if (!a || !va(a)) {
      (mt.delete(e),
        t.inputPermissions.setPermissionCategory(wa.Jump, !0),
        t.setDynamicProperty(ropeJumpLockProperty, void 0));
      continue;
    }
    let u = 0;
    switch (i) {
      case xa.Pressed:
        t.applyKnockback({ x: 0, z: 0 }, 0.2);
        break;
      case xa.Released:
        ((u = n + fo),
          t.isOnGround
            ? t.isOnGround && (u = 0)
            : (t.addEffect(Pt.JumpBoost, fo, { amplifier: 255, showParticles: !1 }),
              n > 4 && t.clearVelocity()));
        break;
    }
    mt.set(e, { player: t, ticksSinceLastReleased: u });
  }
}, fo);
$l.afterEvents.playerLeave.subscribe((e) => {
  mt.delete(e.playerId);
});
function restoreRopePermission(e) {
  if (!e?.isValid || e.getDynamicProperty(ropeJumpLockProperty) !== !0) return;
  let r = e.dimension.getBlock(e.location);
  r && va(r)
    ? (mt.set(e.id, { player: e, ticksSinceLastReleased: 0 }),
      e.inputPermissions.setPermissionCategory(wa.Jump, !1))
    : (e.inputPermissions.setPermissionCategory(wa.Jump, !0),
      e.setDynamicProperty(ropeJumpLockProperty, void 0));
}
$l.afterEvents.playerSpawn.subscribe((e) => ka.run(() => restoreRopePermission(e.player)));
$l.afterEvents.worldLoad.subscribe(() => {
  for (let e of $l.getAllPlayers()) restoreRopePermission(e);
});
import {
  BlockPermutation as jl,
  BlockVolume as sprinklerVolume,
  EquipmentSlot as mo,
  ItemStack as Sa,
} from '@minecraft/server';
var de = class {
  constructor() {
    this.log = h.getLogger('Sprinkler');
    this.TURN_OFF_TIME_SECONDS = 8;
  }
  onPlayerInteract(r) {
    let { block: t, player: n, dimension: o } = r;
    if (!n) return;
    let i = y.getEquippableComponent(n),
      a = i?.getEquipment(mo.Mainhand),
      u = D.getEntityFromBlock(t);
    if (!u || !u.isValid) return;
    let _ = a?.typeId;
    _ === 'minecraft:water_bucket'
      ? i && this.fill(u, i, o)
      : _ === 'minecraft:bucket'
        ? i && this.empty(u, i, o)
        : this.activate(u);
  }
  fill(r, t, n) {
    r.getProperty('xp_furniture:has_water') ||
      (r.setProperty('xp_furniture:has_water', !0),
      n.playSound('bucket.fill_water', r.location),
      t.setEquipment(mo.Mainhand, new Sa('minecraft:bucket', 1)));
  }
  empty(r, t, n) {
    r.getProperty('xp_furniture:has_water') &&
      (r.setProperty('xp_furniture:has_water', !1),
      n.playSound('bucket.empty_water', r.location),
      t.setEquipment(mo.Mainhand, new Sa('minecraft:water_bucket', 1)));
  }
  activate(r) {
    !r.getProperty('xp_furniture:has_water') ||
      r.getProperty('xp_furniture:is_interacted_with') ||
      (r.setProperty('xp_furniture:is_interacted_with', !0),
      r.setDynamicProperty('xp_furniture:sprinkler_timer', this.TURN_OFF_TIME_SECONDS),
      this.log.debug('Activated'));
  }
  onTick(r) {
    let { block: t } = r,
      n = D.getEntityFromBlock(t);
    if (!n || !n.isValid) return;
    let o = n.getDynamicProperty('xp_furniture:sprinkler_timer');
    if (o !== void 0)
      if (o > 0) {
        n.setDynamicProperty('xp_furniture:sprinkler_timer', o - 1);
        let i = {
          x: Math.floor(n.location.x),
          y: Math.floor(n.location.y),
          z: Math.floor(n.location.z),
        };
        try {
          let a = n.dimension.heightRange,
            u = Math.max(a.min, i.y - 1),
            _ = Math.min(a.max, i.y + 1),
            s = n.dimension.getBlocks(
              new sprinklerVolume(
                { x: i.x - 8, y: u, z: i.z - 8 },
                { x: i.x + 8, y: _, z: i.z + 8 },
              ),
              { includeTypes: ['minecraft:farmland', ...de.CROPS_TYPE_IDS] },
              !0,
            );
          for (let c of s.getBlockLocationIterator()) {
            let p = n.dimension.getBlock(c);
            if (!p) continue;
            if (p.permutation.matches('minecraft:farmland')) de.moisturizeFarmland(p);
            else
              for (let w of de.CROPS_TYPE_IDS)
                if (Math.random() < 0.25 && p.permutation.matches(w)) {
                  se.growCrop(p);
                  break;
                }
          }
          this.log.debug(`Time left: ${o}s`);
        } catch (a) {
          this.log.error('Error in sprinkler activation: ' + a);
        }
      } else
        (n.setProperty('xp_furniture:has_water', !1),
          n.setProperty('xp_furniture:is_interacted_with', !1),
          n.setDynamicProperty('xp_furniture:sprinkler_timer', void 0),
          this.log.debug('Turned off'));
  }
  static moisturizeFarmland(r, t = !0) {
    if (!(Math.random() > 0.5 && t)) {
      try {
        r?.setPermutation(jl.resolve('minecraft:farmland', { moisturized_amount: 7 }));
      } catch {}
      r?.dimension.spawnParticle(
        'xp_furniture:water_drip_particle',
        f.from(r.location).add({ x: 0.5, y: 0.9, z: 0.5 }),
      );
    }
  }
};
((de.componentId = 'xp_furniture:sprinkler'),
  (de.CROPS_TYPE_IDS = [
    'minecraft:wheat',
    'minecraft:beetroot',
    'minecraft:carrots',
    'minecraft:potatoes',
    'minecraft:melon_stem',
    'minecraft:pumpkin_stem',
    'minecraft:nether_wart',
    'minecraft:sweet_berry_bush',
    'minecraft:pitcher_crop',
    'minecraft:torchflower_crop',
    'xp_furniture:bell_pepper_block',
    'xp_furniture:cabbage_block',
    'xp_furniture:corn_block',
    'xp_furniture:eggplant_block',
    'xp_furniture:tomato_block',
  ]),
  d([m], de.prototype, 'onPlayerInteract', 1),
  d([m], de.prototype, 'onTick', 1),
  (de = d([x], de)));
import {
  BlockPermutation as go,
  TicksPerSecond as Vl,
  system as gt,
  world as ze,
  MolangVariableMap as Ul,
  Direction as Jl,
  EquipmentSlot as Xl,
} from '@minecraft/server';
var mn = h.getLogger('FurniturePack', 'Interactive', 'Stove'),
  Yl = Rt.cook_items,
  Kl = Rt.fuel_items,
  xe = class {
    static getFuelKey(r, t) {
      return `${r}:${t.x},${t.y},${t.z}`;
    }
    static getLegacyFuelKey(r) {
      return `legacy:${r.x},${r.y},${r.z}`;
    }
    static ensureFuelLoaded() {
      if (this.fuelLoaded) return;
      this.fuelLoaded = !0;
      let r;
      try {
        let t = ze.getDynamicProperty(this.FUEL_CHUNK_META_PROPERTY),
          n,
          o;
        if (typeof t == 'string')
          try {
            o = JSON.parse(t);
          } catch {}
        if (
          (o?.generation === 'a' || o?.generation === 'b') &&
          Number.isInteger(o.count) &&
          o.count > 0 &&
          o.count <= this.MAX_FUEL_CHUNKS
        ) {
          let i = [];
          for (let a = 0; a < o.count; a++) {
            let u = ze.getDynamicProperty(`${this.FUEL_CHUNK_PREFIX}${o.generation}_${a}`);
            if (typeof u != 'string')
              throw new Error(`Missing stove fuel ${o.generation} chunk ${a}/${o.count}`);
            i.push(u);
          }
          n = i.join('');
        } else {
          let i = ze.getDynamicProperty(this.FUEL_CHUNK_COUNT_PROPERTY);
          if (Number.isInteger(i) && i > 0 && i <= this.MAX_FUEL_CHUNKS) {
            let a = [];
            for (let u = 0; u < i; u++) {
              let _ = ze.getDynamicProperty(this.FUEL_CHUNK_PREFIX + u);
              if (typeof _ != 'string')
                throw new Error(`Missing legacy stove fuel chunk ${u}/${i}`);
              a.push(_);
            }
            n = a.join('');
          } else n = ze.getDynamicProperty('xp_furniture:stove') || '[]';
        }
        r = JSON.parse(n);
      } catch (t) {
        (mn.error('Failed to parse stove list:', t), (r = []));
      }
      if (!Array.isArray(r)) r = [];
      for (let t of r) {
        if (!t?.location || !Number.isFinite(t.fuelDownTime) || t.fuelDownTime <= 0) continue;
        let n = t.dimensionId
            ? this.getFuelKey(t.dimensionId, t.location)
            : this.getLegacyFuelKey(t.location),
          o = this.fuelByStove.get(n);
        o
          ? (o.fuelDownTime += t.fuelDownTime)
          : this.fuelByStove.set(n, {
              dimensionId: t.dimensionId,
              location: { x: t.location.x, y: t.location.y, z: t.location.z },
              fuelDownTime: t.fuelDownTime,
            });
      }
    }
    static resolveFuelKey(r) {
      this.ensureFuelLoaded();
      let t = this.getFuelKey(r.dimension.id, r.location);
      if (this.fuelByStove.has(t)) return t;
      let n = this.getLegacyFuelKey(r.location),
        o = this.fuelByStove.get(n);
      return (
        o &&
          (this.fuelByStove.delete(n),
          (o.dimensionId = r.dimension.id),
          this.fuelByStove.set(t, o),
          this.scheduleFuelSave()),
        t
      );
    }
    static clearFuelGeneration(r, t) {
      if ((r !== 'a' && r !== 'b') || !Number.isInteger(t) || t <= 0) return;
      for (let n = 0; n < t; n++)
        ze.setDynamicProperty(`${this.FUEL_CHUNK_PREFIX}${r}_${n}`, void 0);
      ze.setDynamicProperty(`${this.FUEL_CHUNK_PREFIX}${r}_count`, void 0);
    }
    static writeFuelData(r) {
      let t,
        n = ze.getDynamicProperty(this.FUEL_CHUNK_META_PROPERTY),
        o = ze.getDynamicProperty(this.FUEL_CHUNK_COUNT_PROPERTY),
        i = Number.isInteger(o) && o > 0 ? o : 0;
      if (typeof n == 'string')
        try {
          t = JSON.parse(n);
        } catch {}
      let a = [],
        u = t?.generation === 'a' ? 'b' : 'a',
        _ = ze.getDynamicProperty(`${this.FUEL_CHUNK_PREFIX}${u}_count`),
        s = Number.isInteger(_) && _ > 0 ? _ : 0;
      for (let c = 0; c < r.length; c += this.FUEL_CHUNK_SIZE)
        a.push(r.slice(c, c + this.FUEL_CHUNK_SIZE));
      if (a.length > this.MAX_FUEL_CHUNKS)
        throw new Error(
          `Stove fuel data requires ${a.length} chunks; maximum is ${this.MAX_FUEL_CHUNKS}`,
        );
      for (let c = 0; c < a.length; c++)
        ze.setDynamicProperty(`${this.FUEL_CHUNK_PREFIX}${u}_${c}`, a[c]);
      (ze.setDynamicProperty(`${this.FUEL_CHUNK_PREFIX}${u}_count`, a.length),
        ze.setDynamicProperty(
          this.FUEL_CHUNK_META_PROPERTY,
          JSON.stringify({ generation: u, count: a.length }),
        ),
        ze.setDynamicProperty('xp_furniture:stove', '[]'));
      for (let c = a.length; c < s; c++)
        ze.setDynamicProperty(`${this.FUEL_CHUNK_PREFIX}${u}_${c}`, void 0);
      for (let c = 0; c < i; c++) ze.setDynamicProperty(this.FUEL_CHUNK_PREFIX + c, void 0);
      ze.setDynamicProperty(this.FUEL_CHUNK_COUNT_PROPERTY, void 0);
      this.clearFuelGeneration(t?.generation, t?.count);
    }
    static scheduleFuelSave(r = Vl) {
      this.fuelSaveScheduled ||
        ((this.fuelSaveScheduled = !0),
        gt.runTimeout(() => {
          this.fuelSaveScheduled = !1;
          try {
            (this.writeFuelData(JSON.stringify([...this.fuelByStove.values()])),
              (this.fuelSaveFailures = 0));
          } catch (t) {
            (this.fuelSaveFailures++,
              mn.error(`Failed to save stove fuel data (attempt ${this.fuelSaveFailures}):`, t),
              this.scheduleFuelSave(
                this.fuelSaveFailures < 5 ? Vl * 2 ** this.fuelSaveFailures : Vl * 60,
              ));
          }
        }, r));
    }
    static addFuel(r, t) {
      let n = this.resolveFuelKey(r),
        o = this.fuelByStove.get(n);
      (o
        ? (o.fuelDownTime += t)
        : this.fuelByStove.set(n, {
            dimensionId: r.dimension.id,
            location: { x: r.location.x, y: r.location.y, z: r.location.z },
            fuelDownTime: t,
          }),
        this.scheduleFuelSave());
    }
    static consumeFuel(r) {
      let t = this.resolveFuelKey(r),
        n = this.fuelByStove.get(t);
      if (!n) return 0;
      return (
        (n.fuelDownTime -= 1),
        n.fuelDownTime <= 0 && this.fuelByStove.delete(t),
        this.scheduleFuelSave(),
        Math.max(n.fuelDownTime, 0)
      );
    }
    static removeFuel(r) {
      let t = this.resolveFuelKey(r),
        n = this.getLegacyFuelKey(r.location);
      (this.fuelByStove.delete(t), this.fuelByStove.delete(n), this.scheduleFuelSave());
    }
    static clearFuel() {
      (this.ensureFuelLoaded(), this.fuelByStove.clear(), this.scheduleFuelSave());
    }
    static cleanupLoadedFuelEntries() {
      (this.ensureFuelLoaded(), (this.fuelCleanupChanged = !1));
      for (let [r, t] of this.fuelByStove) {
        if (!t.dimensionId) continue;
        let n;
        try {
          n = ze.getDimension(t.dimensionId).getBlock(t.location);
        } catch {
          continue;
        }
        n &&
          !n.typeId.endsWith('_stove_v2') &&
          (this.fuelByStove.delete(r), (this.fuelCleanupChanged = !0));
      }
      this.fuelCleanupChanged && this.scheduleFuelSave();
    }
    onTick(r) {
      let { block: t, dimension: n } = r;
      t.permutation.getState('xp_furniture:lit') &&
        gt.run(() => {
          let o = new Ul();
          switch (t.permutation.getState('minecraft:cardinal_direction')) {
            case 'west':
              o.setFloat('xp_facing', 1);
              break;
            case 'south':
              o.setFloat('xp_facing', 2);
              break;
            case 'east':
              o.setFloat('xp_facing', 3);
              break;
            default:
              o.setFloat('xp_facing', 0);
              break;
          }
          (t.typeId === 'xp_furniture:blackstone_stove_v2'
            ? o.setFloat('xp_is_blue', 1)
            : o.setFloat('xp_is_blue', 0),
            n.spawnParticle('xp_furniture:stove_on', t.center(), o));
          if (xe.consumeFuel(t) === 0) {
            t.setPermutation(
              go.resolve(t.typeId, {
                'minecraft:cardinal_direction': t.permutation.getState(
                  'minecraft:cardinal_direction',
                ),
                'xp_furniture:lit': !1,
              }),
            );
            let u = ne.getExistingCookingPan(t.above());
            if (!u) return;
            (u.dimension
              .getEntitiesAtBlockLocation(u.location)[0]
              ?.setProperty('xp_furniture:is_cooking', !1),
              gt.clearRun(u?.getDynamicProperty('xp_furniture:cooking_pan_runtime')),
              u?.setDynamicProperty('xp_furniture:cooking_pan_runtime', void 0),
              mn.info(
                `Fuel exhausted from stove at ${JSON.stringify(t.location)} | total:`,
                xe.fuelByStove.size,
              ));
          } else {
            let u = ne.getExistingCookingPan(t.above());
            if (!u || u.getDynamicProperty('xp_furniture:cooking_pan_runtime') !== void 0) return;
            let _ = Yl.find((c) =>
              c.item.includes(
                u
                  ?.getTags()
                  .find((p) => p.startsWith('xp_cpan_'))
                  ?.replace('xp_cpan_', ''),
              ),
            );
            if (!_) return;
            let s = gt.runTimeout(() => {
              (u.runCommand(`replaceitem entity @s slot.weapon.mainhand 0 ${_.cooked} 1`),
                u.addTag(`xp_cpan_${_.cooked}`),
                u.removeTag(`xp_cpan_${_.item}`),
                t.dimension.playSound('random.orb', t.center()),
                u.setProperty('xp_furniture:is_cooking', !1));
            }, Vl * _.duration);
            (u.setDynamicProperty('xp_furniture:cooking_pan_runtime', s),
              u.setProperty('xp_furniture:is_cooking', !0));
          }
        });
    }
    onPlayerBreak(r) {
      let { block: t } = r;
      xe.removeFuel(t);
      let o = ne.getExistingCookingPan(t.above());
      o &&
        (gt.clearRun(o?.getDynamicProperty('xp_furniture:cooking_pan_runtime')),
        o.setProperty('xp_furniture:is_cooking', !1),
        mn.info(`Stove removed at ${JSON.stringify(t.location)} | total:`, xe.fuelByStove.size));
    }
    onPlayerInteract(r, t) {
      let n = r.block,
        o = r.player,
        i = r.face,
        a = r.dimension;
      if (!o) return;
      let u = W.getHeldItem(o);
      if (!u) return;
      if (u.type.id == 'xp_furniture:cooking_pan' && i === Jl.Up) {
        let c = n.above();
        if (!c || c.type.id != te.Air) return;
        let w = {
            'minecraft:cardinal_direction': ['north', 'east', 'south', 'west'][
              y.getPlayerCardinalDirection(o)
            ],
            'xp_furniture:inv': 0,
          },
          C = y.getEquippableComponent(o);
        if (!C) return;
        let P;
        (u.amount > 1 && ((P = u.clone()), (P.amount = u.amount - 1)),
          C.setEquipment(Xl.Mainhand, P),
          a.playSound('dig.stone', c),
          c.setPermutation(go.resolve('xp_furniture:cooking_pan', w)));
        return;
      }
      if (
        (!n.typeId.startsWith('xp_furniture:') && !n.typeId.endsWith('_stove')) ||
        n.typeId.includes('cooking_pan')
      )
        return;
      let _ = u.typeId,
        s = Kl.find((c) => c.items.includes(_))?.value ?? 0;
      s !== 0 &&
        gt.run(() => {
          (W.decrementStack(o, u), _ === E.LavaBucket && o.runCommand('give @s bucket'));
          (xe.addFuel(n, s),
            n.setPermutation(
              go.resolve(n.typeId, {
                'minecraft:cardinal_direction': n.permutation.getState(
                  'minecraft:cardinal_direction',
                ),
                'xp_furniture:lit': !0,
              }),
            ),
            mn.info(
              `Fuel (${_} [${s}]) added to stove at ${JSON.stringify(n.location)} | total:`,
              xe.fuelByStove.size,
            ));
        });
    }
  };
((xe.componentId = 'xp_furniture:stove'),
  (xe.fuelByStove = new Map()),
  (xe.fuelLoaded = !1),
  (xe.fuelSaveScheduled = !1),
  (xe.fuelSaveFailures = 0),
  (xe.FUEL_CHUNK_SIZE = 3e4),
  (xe.MAX_FUEL_CHUNKS = 128),
  (xe.FUEL_CHUNK_META_PROPERTY = 'xp_furniture:stove_chunk_meta'),
  (xe.FUEL_CHUNK_COUNT_PROPERTY = 'xp_furniture:stove_chunk_count'),
  (xe.FUEL_CHUNK_PREFIX = 'xp_furniture:stove_chunk_'),
  (xe.isSameLocation = (r, t) => {
    let n = typeof r == 'string' ? JSON.parse(r) : r,
      o = typeof t == 'string' ? JSON.parse(t) : t;
    return n.x === o.x && n.y === o.y && n.z === o.z;
  }),
  d([m], xe.prototype, 'onTick', 1),
  d([m], xe.prototype, 'onPlayerBreak', 1),
  d([m], xe.prototype, 'onPlayerInteract', 1),
  (xe = d([x], xe)));
gt.runInterval(() => xe.cleanupLoadedFuelEntries(), Vl * 60);
gt.afterEvents.scriptEventReceive.subscribe(
  (e) => {
    let { id: r, message: t } = e;
    r === 'xp_furniture_stove:clear_list' && xe.clearFuel();
  },
  { namespaces: ['xp_furniture_stove'] },
);
import {
  Direction as vr,
  EntityComponentTypes as Zl,
  EquipmentSlot as Il,
} from '@minecraft/server';
var Hr = class {
  constructor() {
    this.log = h.getLogger('ToolRack');
    this.interactionAreas = {
      [vr.North]: {
        0: { min: f.from(0.51, 0, 0.3125), max: f.from(1, 1, 0.3125) },
        1: { min: f.from(0, 0, 0.3125), max: f.from(0.49, 1, 0.3125) },
      },
      [vr.South]: {
        0: { min: f.from(0, 0, 0.6875), max: f.from(0.49, 1, 0.6875) },
        1: { min: f.from(0.51, 0, 0.6875), max: f.from(1, 1, 0.6875) },
      },
      [vr.West]: {
        0: { min: f.from(0.3125, 0, 0.51), max: f.from(0.3125, 1, 1) },
        1: { min: f.from(0.3125, 0, 0), max: f.from(0.3125, 1, 0.49) },
      },
      [vr.East]: {
        0: { min: f.from(0.6875, 0, 0), max: f.from(0.6875, 1, 0.49) },
        1: { min: f.from(0.6875, 0, 0.51), max: f.from(0.6875, 1, 1) },
      },
    };
    this.acceptedItems = [
      E.DiamondAxe,
      E.DiamondHoe,
      E.DiamondPickaxe,
      E.DiamondShovel,
      E.DiamondSword,
      E.GoldenAxe,
      E.GoldenHoe,
      E.GoldenPickaxe,
      E.GoldenShovel,
      E.GoldenSword,
      E.IronAxe,
      E.IronHoe,
      E.IronPickaxe,
      E.IronShovel,
      E.IronSword,
      E.NetheriteAxe,
      E.NetheriteHoe,
      E.NetheritePickaxe,
      E.NetheriteShovel,
      E.NetheriteSword,
      E.StoneAxe,
      E.StoneHoe,
      E.StonePickaxe,
      E.StoneShovel,
      E.StoneSword,
      E.WoodenAxe,
      E.WoodenHoe,
      E.WoodenPickaxe,
      E.WoodenShovel,
      E.WoodenSword,
      E.Bow,
      E.Crossbow,
      E.Trident,
      E.FishingRod,
      E.Mace,
      E.CopperAxe,
      E.CopperHoe,
      E.CopperPickaxe,
      E.CopperShovel,
      E.CopperSword,
      E.CopperSpear,
      E.DiamondSpear,
      E.GoldenSpear,
      E.IronSpear,
      E.NetheriteSpear,
      E.StoneSpear,
      E.WoodenSpear,
    ];
  }
  onPlayerInteract(r) {
    let { block: t, faceLocation: n, face: o, dimension: i, player: a } = r,
      u = t.center();
    if (!a || !n) return;
    let _ = t.permutation.getState('minecraft:cardinal_direction') ?? 'north';
    if (o !== Fe.Opposites[_.charAt(0).toUpperCase() + _.slice(1)]) return;
    let s = y.getEquippableComponent(a);
    if (!s) return;
    let c = y.getInventoryComponent(a)?.container;
    if (!c) return;
    let p = D.getEntityFromBlock(t);
    if (!p) return;
    let w = p.getComponent(Zl.Inventory)?.container;
    if (!w) return;
    let C = this.getInteractionSlot(o, n);
    if (C === null) return;
    let P = s.getEquipment(Il.Mainhand);
    if (P && this.acceptedItems.includes(P.typeId)) {
      this.placeItemOnRack(c, P, C, w);
      return;
    }
    this.removeItemFromRack(w, C, i, u);
  }
  getInteractionSlot(r, t) {
    let n = this.interactionAreas[r];
    if (!n) return null;
    let o;
    if (r === vr.North || r === vr.South)
      o = t.x >= n[0].min.x && t.x <= n[0].max.x && t.y >= n[0].min.y && t.y <= n[0].max.y;
    else if (r === vr.East || r === vr.West)
      o = t.y >= n[0].min.y && t.y <= n[0].max.y && t.z >= n[0].min.z && t.z <= n[0].max.z;
    else return null;
    return o ? 0 : 1;
  }
  placeItemOnRack(r, t, n, o) {
    if (o.getItem(n)) return;
    let a = r.find(t);
    a !== void 0 && (r.moveItem(a, n, o), this.log.debug(`Placed: ${t.typeId}, slot: ${n}`));
  }
  removeItemFromRack(r, t, n, o) {
    let i = r.getItem(t);
    i &&
      (n.spawnItem(i, o),
      r.setItem(t, void 0),
      this.log.debug(`Removed: ${i.typeId}, slot: ${t}`),
      n.playSound('random.pop', o));
  }
};
((Hr.componentId = 'xp_furniture:tool_rack'),
  d([m], Hr.prototype, 'onPlayerInteract', 1),
  (Hr = d([x], Hr)));
import {
  BlockPermutation as Ca,
  EquipmentSlot as Tl,
  GameMode as Ml,
  system as Pa,
  world as es,
} from '@minecraft/server';
var Ea = [
    ...ur,
    'minecraft:tall_grass',
    'minecraft:fern',
    'minecraft:large_fern',
    'minecraft:yellow_flower',
    'minecraft:poppy',
    'minecraft:blue_orchid',
    'minecraft:allium',
    'minecraft:azure_bluet',
    'minecraft:red_tulip',
    'minecraft:orange_tulip',
    'minecraft:white_tulip',
    'minecraft:pink_tulip',
    'minecraft:oxeye_daisy',
    'minecraft:sunflower',
    'minecraft:lilac',
    'minecraft:rose_bush',
    'minecraft:peony',
    'minecraft:seagrass',
    'minecraft:sea_pickle',
    'minecraft:deadbush',
    'minecraft:oak_leaves',
    'minecraft:spruce_leaves',
    'minecraft:birch_leaves',
    'minecraft:jungle_leaves',
    'minecraft:acacia_leaves',
    'minecraft:dark_oak_leaves',
    'minecraft:cherry_leaves',
    'xp_furniture:dogwood_sapling',
    'xp_furniture:yellow_birch_sapling',
    'xp_furniture:orange_acacia_sapling',
    'xp_furniture:golden_chain_sapling',
    'xp_furniture:wisteria_sapling',
    'xp_furniture:willow_sapling',
    'xp_furniture:dog_wood_leaves',
    'xp_furniture:dog_wood_leaves_full',
    'xp_furniture:fallen_leaves',
    'xp_furniture:golden_chain_leaves_full',
    'xp_furniture:golden_chain_leaves_hanging_bottom',
    'xp_furniture:golden_chain_leaves_hanging_top',
    'xp_furniture:golden_chain_leaves',
    'xp_furniture:leaf_pile',
    'xp_furniture:orange_acacia_leaves_full',
    'xp_furniture:orange_acacia_leaves',
    'xp_furniture:willow_leaves_full',
    'xp_furniture:willow_leaves_hanging_bottom',
    'xp_furniture:willow_leaves_hanging_top',
    'xp_furniture:willow_leaves',
    'xp_furniture:wisteria_leaves_full',
    'xp_furniture:wisteria_leaves_hanging_bottom',
    'xp_furniture:wisteria_leaves_hanging_top',
    'xp_furniture:wisteria_leaves',
    'xp_furniture:yellow_birch_leaves_full',
    'xp_furniture:yellow_birch_leaves',
  ],
  rs = ['xp_furniture:wisteria_sapling', 'xp_furniture:willow_sapling'],
  Qe = h.getLogger('FurniturePack', 'Interactive', 'Tree Sapling'),
  Qr = class {
    onRandomTick(r) {
      Qe.info('Try to grow!!');
      let t = r.block.permutation.getState('xp_furniture:age');
      if (typeof t != 'number') throw new Error(`Block ${r.block.typeId} is missing age state`);
      if ((Qe.info(t), t >= 10)) {
        (Qe.info('Tree is grown'), ya(r.block));
        return;
      }
      (Qe.info('Tree is growing', r.block.typeId, r.block.location),
        r.block.setPermutation(Ca.resolve(r.block.typeId, { 'xp_furniture:age': t + 1 })));
    }
    onPlayerInteract(r) {
      let { player: t, block: n } = r;
      if (!t) return;
      let o = y.getEquippableComponent(t);
      if (o === void 0) return;
      let i = o.getEquipment(Tl.Mainhand);
      if (i === void 0 || i.typeId !== 'minecraft:bone_meal') return;
      let a = t.getGameMode(),
        u = n.permutation.getState('xp_furniture:age');
      if (u === void 0) throw new Error(`Block ${n.typeId} is missing age state`);
      if (
        ((u = u + (Math.floor(Math.random() * 2) + 1)),
        n.dimension.spawnParticle(
          'minecraft:crop_growth_emitter',
          f.from(n.location).add(0.5, 0.5, 0.5),
        ),
        Qe.info(u),
        u >= 10 || a === Ml.Creative)
      ) {
        (Qe.info('Tree is grown'), ya(n));
        return;
      }
      (Qe.info('Tree is fertilized'),
        W.decrementStack(t, i.type.id),
        n.setPermutation(Ca.resolve(n.typeId, { 'xp_furniture:age': u })));
    }
  };
((Qr.componentId = 'xp_furniture:sapling'),
  d([m], Qr.prototype, 'onRandomTick', 1),
  d([m], Qr.prototype, 'onPlayerInteract', 1),
  (Qr = d([x], Qr)));
function ya(e) {
  let r = e.typeId,
    t = f.from(e.location),
    n = e.dimension,
    o = es.structureManager,
    i = as(e),
    a = ts(r, o, i);
  if (!a) {
    Qe.debug(`No structure found for tree type ${r}`);
    return;
  }
  let u = ns(a);
  u = os(u, e, i);
  let _ = t.add(u),
    s = a.size,
    c = t.add(0.5, 1, 0.5),
    p = [
      c,
      c.add(1, 0, 0),
      c.add(-1, 0, 0),
      c.add(0, 0, 1),
      c.add(0, 0, -1),
      c.add(1, 0, 1),
      c.add(-1, 0, -1),
      c.add(1, 0, -1),
      c.add(-1, 0, 1),
    ],
    w = [];
  for (let C of p) w.push(n.getBlockFromRay(C, f.Up, { maxDistance: s.y - 1, excludeTypes: Ea }));
  if (w.some((C) => C !== void 0)) {
    Qe.debug(`Tree struct ${a.id} is colliding with block`);
    return;
  }
  Pa.runJob(is(a, _, t, n, i));
}
function ts(e, r, t = !1) {
  let n = Math.floor(Math.random() * 6);
  t && (n = Math.floor(Math.random() * 3) + 6);
  let o;
  switch (e) {
    case 'xp_furniture:dogwood_sapling':
      o = r.get(`xp_furniture:dogwood${n}`);
      break;
    case 'xp_furniture:yellow_birch_sapling':
      o = r.get(`xp_furniture:yellowbirch${n}`);
      break;
    case 'xp_furniture:orange_acacia_sapling':
      o = r.get(`xp_furniture:orangeacacia${n}`);
      break;
    case 'xp_furniture:golden_chain_sapling':
      o = r.get(`xp_furniture:goldenchain${n}`);
      break;
    case 'xp_furniture:wisteria_sapling':
      o = r.get(`xp_furniture:wisteria${n}`);
      break;
    case 'xp_furniture:willow_sapling':
      o = r.get(`xp_furniture:willow${n}`);
      break;
  }
  return o;
}
function ns(e) {
  let r = e.size;
  for (let t = 0; t < r.x; t++)
    for (let n = 0; n < r.z; n++) {
      let o = e.getBlockPermutation({ x: t, y: 0, z: n });
      if (
        !(!o || o.type.id === 'minecraft:air' || o.type.id === 'minecraft:structure_void') &&
        o.type.id.includes('log')
      )
        return new f(-t, 0, -n);
    }
  return new f(0, 0, 0);
}
function os(e, r, t) {
  if (!t) return e;
  let n = r.typeId,
    o = f.from(r.location),
    i = r.dimension,
    a = [f.from(1, 0, 1), f.from(-1, 0, -1), f.from(1, 0, -1), f.from(-1, 0, 1)];
  for (let u of a)
    if (
      ht(n, i.getBlock(o.add(u))) &&
      ht(n, i.getBlock(o.add(u.x, 0, 0))) &&
      ht(n, i.getBlock(o.add(0, 0, u.z)))
    )
      return e.add(u.x < 0 ? u.x : 0, 0, u.z < 0 ? u.z : 0);
  return e;
}
function* is(e, r, t, n, o) {
  Qe.info(`Placing tree structure ${e.id} at ${r}`);
  let i = e.size,
    a = Math.floor(Math.random() * 4);
  function u(s, c, p) {
    if (p) return s;
    let w = s.x - t.x,
      C = s.z - t.z;
    for (let P = 0; P < c % 4; P++) [w, C] = [-C, w];
    return new f(t.x + w, s.y, t.z + C);
  }
  let _ = [];
  for (let s = 0; s < i.y; s++)
    for (let c = 0; c < i.x; c++)
      for (let p = 0; p < i.z; p++) {
        let w = new f(c, s, p),
          C = e.getBlockPermutation(w);
        if (!(!C || C.type.id === 'minecraft:air' || C.type.id === 'minecraft:structure_void')) {
          {
            let P = u(r.add(w), a, o),
              O = n.getBlock(P);
            if (!O) continue;
            if (
              (Ea.includes(O.typeId) && O.setPermutation(C),
              O.typeId.endsWith('_leaves') && _.push(O),
              O.matches(te.OakLog) && O.permutation.getState('pillar_axis') !== 'y')
            ) {
              let F = 'x';
              ((a === 1 || a === 2) && (F = 'z'),
                O.setPermutation(O.permutation.withState('pillar_axis', F)));
            }
          }
          yield;
        }
      }
  for (let s of _)
    (Pa.run(() => {
      s.permutation.getState('xp_furniture:persistent') &&
        s.setPermutation(s.permutation.withState('xp_furniture:persistent', !1));
    }),
      At.updateLeaves(s),
      yield);
}
function as(e) {
  let r = e.typeId,
    t = f.from(e.location),
    n = e.dimension;
  if (!rs.includes(r)) return !1;
  let o = [f.from(1, 0, 1), f.from(-1, 0, -1), f.from(1, 0, -1), f.from(-1, 0, 1)];
  for (let i of o)
    if (
      ht(r, n.getBlock(t.add(i))) &&
      ht(r, n.getBlock(t.add(i.x, 0, 0))) &&
      ht(r, n.getBlock(t.add(0, 0, i.z)))
    )
      return !0;
  return !1;
}
function ht(e, r) {
  return !r || r.typeId === e;
}
import {
  EquipmentSlot as us,
  GameMode as _s,
  ItemComponentTypes as gn,
  ItemStack as ho,
  Player as ls,
} from '@minecraft/server';
var tr = class {
  constructor() {
    this.log = h.getLogger('WateringCan');
  }
  beforeOnPlayerPlace(r) {
    let { block: t, face: n, player: o, permutationToPlace: i } = r;
    if (!o) return;
    let a = W.getHeldItem(o);
    if (!a) return;
    let { typeId: u } = a,
      _ = u === 'xp_furniture:watering_can_empty' ? t : q.getBlockInFace(t, Fe.Opposites[n]);
    if (_) {
      if (!o.isSneaking && (_.isLiquid || de.CROPS_TYPE_IDS.includes(_.typeId))) {
        r.cancel = !0;
        return;
      }
      if (u === 'xp_furniture:watering_can') {
        let s = a.getComponent(gn.Durability);
        if (!s) return;
        r.permutationToPlace = i.withState('xp_furniture:water_amount', s.damage);
      }
    }
  }
  onUseOn(r) {
    let { block: t, blockFace: n, itemStack: o, source: i } = r;
    if (!(i instanceof ls)) return;
    let { typeId: a } = o,
      u = a === 'xp_furniture:watering_can' ? t : q.getBlockInFace(t, n);
    if (!u) return;
    let _ = de.CROPS_TYPE_IDS.includes(u.typeId);
    u.isLiquid
      ? this.refill(i, o)
      : !i.isSneaking &&
        a === 'xp_furniture:watering_can' &&
        (_ || u.matches(te.Farmland)) &&
        this.water(i, o, u, _);
  }
  onPlayerBreak(r) {
    let { block: t, brokenBlockPermutation: n, player: o } = r;
    if (!o || o.getGameMode() === _s.Creative) return;
    let i = n.getState('xp_furniture:water_amount');
    if (n.type.id === 'xp_furniture:watering_can' && i !== void 0) {
      let a = new ho('xp_furniture:watering_can', 1),
        u = a.getComponent(gn.Durability);
      (u && (u.damage = i), t.dimension.spawnItem(a, t.center()));
    }
  }
  refill(r, t) {
    if (t.typeId === 'xp_furniture:watering_can_empty') t = new ho('xp_furniture:watering_can');
    else {
      let n = t.getComponent(gn.Durability);
      if (!n || n.damage <= 0) return;
      n.damage -= 1;
    }
    (this.replaceItem(r, t),
      r.playAnimation('animation.xp_furniture.watering_can.fill'),
      r.dimension.playSound('bucket.fill_water', r.location));
  }
  water(r, t, n, o) {
    o ? se.growCrop(n, 1, 'xp_furniture:watering_can_drip') : de.moisturizeFarmland(n, !1);
    let i = t.getComponent(gn.Durability);
    i &&
      (i.damage >= i.maxDurability - 1
        ? (t = new ho('xp_furniture:watering_can_empty', 1))
        : (i.damage += 1),
      this.replaceItem(r, t),
      r.dimension.playSound('bucket.empty_water', r.location),
      r.playAnimation('animation.xp_furniture.watering_can.use'));
  }
  replaceItem(r, t) {
    y.getEquippableComponent(r)?.setEquipment(us.Mainhand, t);
  }
};
((tr.componentId = 'xp_furniture:watering_can'),
  d([m], tr.prototype, 'beforeOnPlayerPlace', 1),
  d([m], tr.prototype, 'onUseOn', 1),
  d([m], tr.prototype, 'onPlayerBreak', 1),
  (tr = d([x, Zt], tr)));
import { TicksPerSecond as Da, world as ss } from '@minecraft/server';
var ds = h.getLogger('FurniturePack', 'Interactive', 'Wood Mug');
ss.afterEvents.itemCompleteUse.subscribe((e) => {
  let { itemStack: r, source: t } = e;
  if (r.typeId !== 'xp_furniture:wood_mug_drink_full') return;
  let n = t.getEffect('regeneration');
  (t.addEffect('regeneration', Da * (14 + ((n?.duration ?? 0) / Da) * 0.5), {
    amplifier: Math.min((n?.amplifier ?? -1) + 1, 5),
  }),
    ds.info(t.getEffect('regeneration')));
});
import { BlockPermutation as cs, system as ps } from '@minecraft/server';
var Sr = class {
  beforeOnPlayerPlace(r) {
    let { player: t, block: n, dimension: o, permutationToPlace: i } = r;
    if (!t) {
      r.cancel = !0;
      return;
    }
    let a = n,
      u = n.above(),
      _ = [a, u],
      s = i.getAllStates();
    (ps.run(() => {
      (o.playSound('dig.grass', n.center()),
        _.forEach((c, p) => {
          ((s['xp_furniture:top_piece_bit'] = p), c.setPermutation(cs.resolve(i.type.id, s)));
        }),
        W.decrementStack(t, i.type.id));
    }),
      (r.permutationToPlace = r.block.permutation));
  }
  onBreak(r) {
    let { block: t, brokenBlockPermutation: n } = r;
    switch (n.getAllStates()['xp_furniture:top_piece_bit']) {
      case 0:
        {
          let a = t.above();
          if (!a || a.type.id != n.type.id) return;
          a.setType('minecraft:air');
        }
        break;
      case 1:
        {
          let a = t.below();
          if (!a || a.type.id != n.type.id) return;
          a.setType('minecraft:air');
        }
        break;
    }
  }
};
((Sr.componentId = 'xp_furniture:double_plants'),
  (Sr.log = h.getLogger('DoublePlantsComponent')),
  d([m], Sr.prototype, 'beforeOnPlayerPlace', 1),
  d([m], Sr.prototype, 'onBreak', 1),
  (Sr = d([x], Sr)));
import {
  BlockPermutation as fs,
  BlockVolume as Ba,
  ItemStack as Aa,
  system as Wa,
} from '@minecraft/server';
var Le = class {
  onPlayerBreak(r) {
    let { block: t, dimension: n, brokenBlockPermutation: o } = r,
      i = 0,
      a = f.from(t.location);
    if (
      o.type.id.includes('leaves_hanging_bottom') ||
      t.type.id.includes('leaves_hanging_bottom')
    ) {
      let u = n.getBlock(a.up());
      if ((q.destroyBlock(t), !u || !u.type.id.includes('leaves_hanging_top'))) return;
      u.setType(u.type.id.replace('top', 'bottom'));
      return;
    }
    for (let u = 0; u <= 3; u++) {
      let _ = n.getBlock(a.subtract({ x: 0, y: u, z: 0 }));
      if (!_ || !_.type.id.includes('leaves_hanging')) {
        Le.log.info(i);
        break;
      }
      i--;
    }
    i != 0 &&
      (Le.log.info(`Blocks Below Lenght - ${i}`), q.destroyMultiBlock(t, [1, i + 2, 1], []));
  }
};
((Le.componentId = 'xp_furniture:hanging_leaves_break'),
  (Le.log = h.getLogger('HangingLeavesComponent')),
  d([m], Le.prototype, 'onPlayerBreak', 1),
  (Le = d([x], Le)));
var ce = class {
  onRandomTick(r, t) {
    let n = this.validate(t.params);
    if (!n) return;
    let { block: o } = r,
      i = o.dimension,
      a = f.from(o.location),
      u = o.permutation.getAllStates(),
      _ = 0;
    o.typeId.includes('hanging') && (_ = 0.8);
    let s = new f(a.x + 0.5, a.y + _, a.z + 0.5);
    if (
      (i.spawnParticle(n.particleId, s),
      u['xp_furniture:persistent'] || o.type.id.includes('hanging'))
    )
      return;
    let c = 3,
      p = 1,
      w = new Ba(a.add({ x: c, y: c, z: c }), a.subtract({ x: c, y: c, z: c })),
      C = new Ba(a.add({ x: p, y: p, z: p }), a.subtract({ x: p, y: p, z: p }));
    if (i.getBlocks(w, { includeTypes: [n.logBlockType] }, !0).getCapacity() == 0) {
      ([o.north(), o.south(), o.east(), o.west(), o.above(), o.below()].forEach((B) => {
        !B ||
          !B.type.id.startsWith(o.type.id) ||
          B.type.id.includes('hanging') ||
          B.setPermutation(fs.resolve(o.type.id, u));
      }),
        this.DropLoot(o, n.saplingType),
        this.BreakHangingLeaves(o),
        Wa.run(() => q.destroyBlock(o)));
      return;
    }
    i.getBlocks(C, { includeTypes: [o.type.id] }, !0).getCapacity() <= 3 &&
      (this.DropLoot(o, n.saplingType),
      this.BreakHangingLeaves(o),
      Wa.run(() => q.destroyBlock(o)));
  }
  onPlayerBreak(r) {
    this.BreakHangingLeaves(r.block);
  }
  DropLoot(r, t) {
    if (!t) return;
    let n = Math.random(),
      o = Math.random();
    (n <= 0.05 && r.dimension.spawnItem(new Aa(`xp_furniture:${t}_sapling`), r.center()),
      o <= 0.01 && r.dimension.spawnItem(new Aa('minecraft:stick'), r.center()));
  }
  BreakHangingLeaves(r) {
    let t = r.below();
    if (!t || !t.type.id.includes('leaves_hanging')) return;
    let n = {
      player: void 0,
      block: t,
      dimension: r.dimension,
      brokenBlockPermutation: t.permutation,
    };
    new Le().onPlayerBreak(n);
  }
  validate(r) {
    if (typeof r != 'object' || r === null) {
      ce.log.error('FallingLeavesComponent has no arguments. Expected an object.');
      return;
    }
    for (let [t, n] of Object.entries(ce.schema)) {
      if (!(t in r)) {
        if (n.required) {
          ce.log.error(`FallingLeavesComponent is missing required argument: "${t}"`);
          return;
        }
        continue;
      }
      let o = r[t],
        i = ce.typeValidators[n.type];
      if (i && !i(o)) {
        ce.log.error(
          `FallingLeavesComponent | "${t}" has an invalid type. Expected ${n.type}, got ${JSON.stringify(o)}`,
        );
        return;
      }
    }
    return r;
  }
};
((ce.componentId = 'xp_furniture:falling_leaves'),
  (ce.log = h.getLogger('FallingLeavesComponent')),
  (ce.typeValidators = { string: (r) => typeof r == 'string' }),
  (ce.schema = {
    logBlockType: { type: 'string', required: !0 },
    particleId: { type: 'string', required: !0 },
    saplingType: { type: 'string', required: !1 },
  }),
  d([m], ce.prototype, 'onRandomTick', 1),
  d([m], ce.prototype, 'onPlayerBreak', 1),
  (ce = d([x], ce)));
var bt = class {
  beforeOnPlayerPlace(r) {
    let { permutationToPlace: t } = r,
      n = Math.floor(Math.random() * 3);
    r.permutationToPlace = t.withState('xp_furniture:variant', n);
  }
};
((bt.componentId = 'xp_furniture:ivy'),
  d([m], bt.prototype, 'beforeOnPlayerPlace', 1),
  (bt = d([x], bt)));
var xt = class {
  beforeOnPlayerPlace(r) {
    let { permutationToPlace: t } = r,
      n;
    try {
      n = t.withState('xp_furniture:is_placed', !0);
    } catch {
      return;
    }
    n !== void 0 && (r.permutationToPlace = n);
  }
};
((xt.componentId = 'xp_furniture:placement_bound'),
  d([m], xt.prototype, 'beforeOnPlayerPlace', 1),
  (xt = d([x], xt)));
var jr = class {
  constructor() {
    this.rotationStates = ['north', 'east', 'south', 'west'];
  }
  beforeOnPlayerPlace(r, t) {
    let n = r.permutationToPlace.getAllStates();
    ((n['minecraft:cardinal_direction'] =
      this.rotationStates[Math.floor(Math.random() * this.rotationStates.length)]),
      (r.permutationToPlace = Q(r.permutationToPlace.type.id, n)));
  }
};
((jr.componentId = 'xp_furniture:random_rotate'),
  d([m], jr.prototype, 'beforeOnPlayerPlace', 1),
  (jr = d([x], jr)));
import { MolangVariableMap as ms } from '@minecraft/server';
var Cr = class {
  constructor() {
    this.indexedBlocks = [
      'xp_furniture:frog_statue',
      'xp_furniture:skeleton_statue',
      'xp_furniture:wolf_statue',
    ];
  }
  onTick(r) {
    let { block: t } = r,
      n = new ms();
    if (
      (n.setFloat('angle', this.rotationFromState(t).y),
      (t.permutation.getState('xp_furniture:top_piece_bit') ?? 1) !== 1)
    )
      return;
    let i = { x: 0, y: 0, z: 0 };
    t.typeId === 'xp_furniture:frog_statue' ? (i.y = 0.25) : (i.y = 0.5);
    let a = 0;
    t.typeId === 'xp_furniture:skeleton_statue'
      ? (a = 1)
      : t.typeId === 'xp_furniture:frog_statue'
        ? (a = 0.45)
        : t.typeId === 'xp_furniture:wolf_statue' && (a = 0.6);
    let u = t.permutation.getState('minecraft:cardinal_direction');
    switch (u) {
      case 'north':
        ((i.x = 0), (i.z = -1));
        break;
      case 'east':
        ((i.x = 1), (i.z = 0));
        break;
      case 'south':
        ((i.x = 0), (i.z = 1));
        break;
      case 'west':
        ((i.x = -1), (i.z = 0));
        break;
      default:
        ((i.x = 0), (i.z = -1));
        break;
    }
    if (((i.x *= a), (i.z *= a), t.typeId === 'xp_furniture:skeleton_statue'))
      switch ((n.setFloat('angle', 180 + this.rotationFromState(t).y), u)) {
        case 'north':
          ((i.x = -0.125), (i.z = 1));
          break;
        case 'east':
          ((i.x = -1), (i.z = -0.125));
          break;
        case 'south':
          ((i.x = 0.125), (i.z = -1));
          break;
        case 'west':
          ((i.x = 1), (i.z = 0.125));
          break;
        default:
          ((i.x = 0.125), (i.z = 1));
          break;
      }
    this.getStatueEntity(t) &&
      t.dimension.spawnParticle(
        'xp_furniture:fountain.spout',
        f.from(t.bottomCenter()).add(i.x, i.y, i.z),
        n,
      );
  }
  onPlayerInteract(r, t) {
    let n = r.block,
      o = this.getStatueEntity(n);
    if (o) o.remove();
    else {
      let i = f.from(n.bottomCenter()),
        a = n.permutation.getState('xp_furniture:top_piece_bit');
      a !== void 0 && +a == 1 && (i = i.subtract(0, 1, 0));
      let u = this.rotationFromState(n);
      r.dimension.runCommand(
        `summon xp_furniture:statue ${i.toString('short', ' ')} ${u.y} ${u.x} ${n.typeId}`,
      );
    }
  }
  getStatueEntity(r) {
    let t = f.from(r.bottomCenter()),
      n = r.permutation.getState('xp_furniture:top_piece_bit');
    n !== void 0 && +n == 1 && (t = t.subtract(0, 1, 0));
    let o = r.dimension.getEntities({
      location: t,
      type: 'xp_furniture:statue',
      maxDistance: 0.3,
      closest: 1,
      propertyOptions: [
        {
          propertyId: 'xp_furniture:statue_type',
          value: { equals: this.indexedBlocks.indexOf(r.typeId) },
        },
      ],
    });
    if (!(!o || o.length === 0)) return o[0];
  }
  rotationFromState(r) {
    switch (r.permutation.getState('minecraft:cardinal_direction')) {
      case 'north':
        return { x: 0, y: 0 };
      case 'east':
        return { x: 0, y: 90 };
      case 'south':
        return { x: 0, y: 180 };
      case 'west':
        return { x: 0, y: 270 };
      default:
        return { x: 0, y: 0 };
    }
  }
};
((Cr.componentId = 'xp_furniture:statue'),
  d([m], Cr.prototype, 'onTick', 1),
  d([m], Cr.prototype, 'onPlayerInteract', 1),
  (Cr = d([x], Cr)));
import { system as Oa, world as gs } from '@minecraft/server';
var ie = class {
  static register(r) {
    let { sourceTypeId: t, sourceType: n, targetTypeId: o, description: i } = r;
    if (!t) {
      this.log.error('Cannot register transformation without sourceTypeId');
      return;
    }
    if (typeof r.transform != 'function') {
      this.log.error(`Cannot register transformation for ${t}: transform must be a function`);
      return;
    }
    let a = this.handlers.get(t) || [];
    (a.push(r), this.handlers.set(t, a), this.registrationOrder.push(t));
    let u = o ? ` -> ${o}` : '',
      _ = i ? ` (${i})` : '';
    this.log.info(`Registered ${n} transformation: ${t}${u}${_}`);
  }
  static getHandlers(r) {
    return this.handlers.get(r) || [];
  }
  static hasTransformation(r) {
    return this.handlers.has(r);
  }
  static getRegisteredSourceTypeIds(r) {
    if (!r) return [...this.handlers.keys()];
    let t = [];
    for (let [n, o] of this.handlers.entries()) o.some((i) => i.sourceType === r) && t.push(n);
    return t;
  }
  static startQueueProcessor() {
    this.queue.length > 0 &&
      !this.processorRunning &&
      ((this.processorRunning = !0),
      (this.processorId = Oa.runInterval(() => {
        this.processNextInQueue();
      }, 2)),
      this.log.info('Queue processor started'));
  }
  static stopQueueProcessor() {
    (this.processorId !== void 0 && (Oa.clearRun(this.processorId), (this.processorId = void 0)),
      (this.processorRunning = !1),
      this.log.info('Queue processor stopped'));
  }
  static queueEntityTransform(r) {
    let t = r.typeId;
    if (!this.hasTransformation(t)) return;
    let o = `entity:${r.id}`;
    if (this.queueKeys.has(o)) return;
    let n = {
      id: r.id,
      queueKey: o,
      type: 'entity',
      entity: r,
      dimensionId: r.dimension.id,
      sourceTypeId: t,
      retries: 0,
      maxRetries: 10,
    };
    (this.queueKeys.add(o),
      this.queue.push(n),
      this.stats.queued++,
      this.log.debug(`Queued entity transformation: ${t} (queue size: ${this.queue.length})`),
      this.processorRunning || this.startQueueProcessor());
  }
  static queueBlockTransform(r, t) {
    let n = r.typeId;
    if (!this.hasTransformation(n)) return;
    let o = r.location,
      a = `block:${r.dimension.id}:${o.x},${o.y},${o.z}`;
    if (this.queueKeys.has(a)) return;
    let i = {
      id: `${o.x},${o.y},${o.z}`,
      queueKey: a,
      type: 'block',
      blockLocation: { x: o.x, y: o.y, z: o.z },
      dimensionId: r.dimension.id,
      sourceTypeId: n,
      event: t,
      retries: 0,
      maxRetries: 10,
    };
    (this.queueKeys.add(a),
      this.queue.push(i),
      this.stats.queued++,
      this.log.debug(`Queued block transformation: ${n} (queue size: ${this.queue.length})`),
      this.processorRunning || this.startQueueProcessor());
  }
  static processNextInQueue() {
    if (this.queue.length === 0) {
      this.stopQueueProcessor();
      return;
    }
    let r = this.queue.shift();
    if (r)
      try {
        let t;
        if (
          (r.type === 'entity'
            ? (t = this.processEntityQueueItem(r))
            : (t = this.processBlockQueueItem(r)),
          t.success)
        )
          (this.queueKeys.delete(r.queueKey),
            this.stats.processed++,
            this.log.debug(
              `Processed transformation: ${r.sourceTypeId} (${this.queue.length} remaining)`,
            ));
        else {
          let n = t.reason || 'unknown reason';
          ((r.lastFailureReason = n),
            r.retries < r.maxRetries
              ? (r.retries++,
                this.queue.push(r),
                this.stats.retried++,
                this.log.debug(
                  `Retrying transformation: ${r.sourceTypeId} (attempt ${r.retries}/${r.maxRetries}) - reason: ${n}`,
                ))
              : (this.queueKeys.delete(r.queueKey),
                this.stats.failed++,
                this.log.warn(
                  `Gave up on transformation after ${r.maxRetries} retries: ${r.sourceTypeId} - last reason: ${n}`,
                )));
        }
      } catch (t) {
        (this.queueKeys.delete(r.queueKey),
          this.log.error(`Error processing queue item: ${t}`),
          this.stats.failed++);
      }
    this.queue.length === 0 && this.stopQueueProcessor();
  }
  static processEntityQueueItem(r) {
    let t = r.entity;
    if (!t || !t.isValid) return { success: !1, reason: `Entity ${r.id} is invalid or unloaded` };
    let n = t.dimension.getBlock(t.location);
    if (!n)
      return {
        success: !1,
        reason: `No block at entity location (${Math.floor(t.location.x)}, ${Math.floor(t.location.y)}, ${Math.floor(t.location.z)}) in ${t.dimension.id}`,
      };
    let o = this.getHandlers(r.sourceTypeId);
    if (o.length === 0) return { success: !0 };
    let i = { entity: t, block: n, dimension: t.dimension },
      a = !1,
      u = 0,
      _ = [];
    for (let s of o) {
      if (s.shouldTransform && !s.shouldTransform(i)) {
        u++;
        continue;
      }
      try {
        s.transform(i) === !1
          ? _.push('Handler reported an unsuccessful transformation')
          : (a = !0);
      } catch (c) {
        (_.push(String(c)), this.log.error(`Failed to transform ${r.sourceTypeId}: ${c}`));
      }
    }
    return a
      ? { success: !0 }
      : _.length > 0
        ? {
            success: !1,
            reason: `All handlers failed for ${r.sourceTypeId}. Errors: ${_.join(' | ')}`,
          }
        : {
            success: !1,
            reason: `No handler conditions matched for ${r.sourceTypeId} (skipped ${u}/${o.length})`,
          };
  }
  static processBlockQueueItem(r) {
    if (!r.blockLocation) return { success: !0 };
    let t;
    try {
      t = gs.getDimension(r.dimensionId);
    } catch {
      return { success: !1, reason: `Dimension ${r.dimensionId} is not available yet` };
    }
    let n = t.getBlock(r.blockLocation);
    if (!n)
      return {
        success: !1,
        reason: `Block at ${r.blockLocation.x},${r.blockLocation.y},${r.blockLocation.z} is not available yet`,
      };
    if (n.typeId !== r.sourceTypeId) return { success: !0 };
    let o = this.getHandlers(r.sourceTypeId);
    if (o.length === 0) return { success: !0 };
    let i = { block: n, dimension: t, event: r.event },
      a = !1,
      u = 0,
      _ = [];
    for (let s of o) {
      if (s.shouldTransform && !s.shouldTransform(i)) {
        u++;
        continue;
      }
      try {
        s.transform(i) === !1
          ? _.push('Handler reported an unsuccessful transformation')
          : (a = !0);
      } catch (c) {
        (_.push(String(c)), this.log.error(`Failed to transform ${r.sourceTypeId}: ${c}`));
      }
    }
    return a
      ? { success: !0 }
      : _.length > 0
        ? {
            success: !1,
            reason: `All handlers failed for ${r.sourceTypeId}. Errors: ${_.join(' | ')}`,
          }
        : {
            success: !1,
            reason: `No handler conditions matched for ${r.sourceTypeId} (skipped ${u}/${o.length})`,
          };
  }
  static executeEntityTransform(r) {
    let t = r.typeId,
      n = this.getHandlers(t);
    if (n.length === 0) return !1;
    let o = r.dimension.getBlock(r.location);
    if (!o) return (this.log.warn(`Cannot transform entity ${t}: no block at location`), !1);
    let i = { entity: r, block: o, dimension: r.dimension },
      a = !1;
    for (let u of n)
      if (!(u.shouldTransform && !u.shouldTransform(i)))
        try {
          (this.log.debug(`Executing transformation: ${t} -> ${u.targetTypeId || 'custom'}`),
            u.transform(i) !== !1 && (a = !0));
        } catch (_) {
          this.log.error(`Failed to transform ${t}: ${_}`);
        }
    return a;
  }
  static executeBlockTransform(r, t) {
    let n = r.typeId,
      o = this.getHandlers(n);
    if (o.length === 0) return !1;
    let i = { block: r, dimension: r.dimension, event: t },
      a = !1;
    for (let u of o)
      if (!(u.shouldTransform && !u.shouldTransform(i)))
        try {
          (this.log.debug(`Executing transformation: ${n} -> ${u.targetTypeId || 'custom'}`),
            u.transform(i) !== !1 && (a = !0));
        } catch (_) {
          this.log.error(`Failed to transform ${n}: ${_}`);
        }
    return a;
  }
  static getStats() {
    let r = {
      total: this.registrationOrder.length,
      byType: { entity: 0, block: 0 },
      queue: {
        pending: this.queue.length,
        queued: this.stats.queued,
        processed: this.stats.processed,
        failed: this.stats.failed,
        retried: this.stats.retried,
      },
    };
    for (let t of this.handlers.values()) for (let n of t) r.byType[n.sourceType]++;
    return r;
  }
  static listTransformations() {
    let r = [];
    for (let [t, n] of this.handlers.entries())
      for (let o of n) {
        let i = o.targetTypeId || 'custom';
        r.push(`${o.sourceType}: ${t} -> ${i}`);
      }
    return r.sort();
  }
  static clear() {
    (this.handlers.clear(),
      (this.registrationOrder = []),
      (this.queue.length = 0),
      this.queueKeys.clear(),
      this.stopQueueProcessor(),
      (this.stats = { queued: 0, processed: 0, failed: 0, retried: 0 }),
      this.log.info('Cleared all transformations'));
  }
  static getQueueSize() {
    return this.queue.length;
  }
};
((ie.log = h.getLogger('TransformationRegistry')),
  (ie.handlers = new Map()),
  (ie.registrationOrder = []),
  (ie.queue = []),
  (ie.queueKeys = new Set()),
  (ie.processorRunning = !1),
  (ie.stats = { queued: 0, processed: 0, failed: 0, retried: 0 }),
  d([ue], ie, 'startQueueProcessor', 1));
import { BlockVolume as hs, system as bs, TicksPerSecond as xs } from '@minecraft/server';
var bo = h.getLogger('TransformationEventHandlers'),
  hn = class {
    static onEntityLoad(r) {
      let t = r.entity;
      !t ||
        !t.isValid ||
        !t.typeId.startsWith('xp_furniture:') ||
        (ie.hasTransformation(t.typeId) &&
          bs.run(() => {
            t.isValid &&
              (ie.queueEntityTransform(t), bo.debug(`Queued entity transformation: ${t.typeId}`));
          }));
    }
    static startBlockScanScheduler() {
      let r = gs.getDynamicProperty('xp_furniture:version');
      ((this.migrationActiveUntil =
        typeof r != 'string' || Vr.compareTo(r) < 0 ? bs.currentTick + this.ACTIVE_WINDOW : 0),
        gs.afterEvents.playerLeave.subscribe((t) => this.playerScanState.delete(t.playerId)),
        bs.runInterval(() => this.scanPlayers(), this.BASE_INTERVAL));
    }
    static scanPlayers() {
      let r = bs.currentTick,
        t = this.BASE_INTERVAL;
      for (let n of y.getAllPlayers()) {
        if (!n.isValid) {
          this.playerScanState.delete(n.id);
          continue;
        }
        let o = this.playerScanState.get(n.id) || {
          lastCheck: -t,
          lastScan: -this.FALLBACK_INTERVAL,
        };
        if (r - o.lastCheck < t) continue;
        o.lastCheck = r;
        let i = `${n.dimension.id}:${Math.floor(n.location.x / 6)},${Math.floor(n.location.y / 6)},${Math.floor(n.location.z / 6)}`;
        if (o.cell !== i || r - o.lastScan >= this.FALLBACK_INTERVAL) {
          let a = this.scanNearbyBlocksForPlayer(n);
          ((o.cell = i),
            (o.lastScan = r),
            a > 0 && (this.migrationActiveUntil = r + this.ACTIVE_WINDOW));
        }
        this.playerScanState.set(n.id, o);
      }
    }
    static scanNearbyBlocksForPlayer(r) {
      if (!r.isValid) return 0;
      let t = ie.getRegisteredSourceTypeIds('block');
      if (t.length === 0) return 0;
      let n = r.dimension,
        o = Math.floor(r.location.x),
        i = Math.floor(r.location.y),
        a = Math.floor(r.location.z),
        u = 3,
        _ = { x: o - u, y: i - u, z: a - u },
        s = { x: o + u, y: i + u, z: a + u },
        c;
      try {
        c = n.getBlocks(new hs(_, s), { includeTypes: t }, !0);
      } catch (p) {
        bo.warn(`Failed nearby block scan for ${r.name} in ${n.id}: ${p}`);
        return 0;
      }
      let p = 0;
      for (let w of c.getBlockLocationIterator()) {
        let C = n.getBlock(w);
        C && (ie.queueBlockTransform(C), p++);
      }
      return (
        p > 0 && bo.debug(`Queued ${p} nearby blocks around ${r.name} for block transform checks`),
        p
      );
    }
  };
((hn.BASE_INTERVAL = xs),
  (hn.STABLE_INTERVAL = xs * 10),
  (hn.FALLBACK_INTERVAL = xs * 60),
  (hn.ACTIVE_WINDOW = xs * 60 * 10),
  (hn.migrationActiveUntil = 0),
  (hn.playerScanState = new Map()));
(d([Zr], hn, 'onEntityLoad', 1), d([ue], hn, 'startBlockScanScheduler', 1));
import { BlockPermutation as Ss, BlockVolume as Cs } from '@minecraft/server';
import { world as yr } from '@minecraft/server';
import {
  CommandPermissionLevel as ks,
  CustomCommandStatus as vs,
  world as La,
} from '@minecraft/server';
var ws = {
    manifest: {
      bp: { version: [2, 5, 4], min_engine_version: [1, 21, 40] },
      rp: { version: [2, 5, 4], min_engine_version: [1, 21, 40] },
    },
    github: { commit: '0efd572aecc163ca03ca314a1119b56de5b5169d', tag: 'v2.5.4' },
  },
  bn = ws;
var Vr = class Vr {
  constructor(r) {
    let [t, n, o] = r.replace(/[^0-9.]/g, '').split('.');
    ((this.major = t), (this.minor = n), (this.patch = o), (this.version = r));
  }
  saveToWorld() {
    La.setDynamicProperty('xp_furniture:version', this.version);
  }
  static onWorldLoad() {
    let r = La.getDynamicProperty('xp_furniture:version'),
      t = Vr.get(),
      n = typeof r == 'string' ? Vr.compareTo(r) : -1;
    (n < 0
      ? (this.log.info(
          `World was loaded with older version (${r ?? 'unknown'}). Upgrading to ${t.version}.`,
        ),
        t.saveToWorld(),
        this.onUpgrade())
      : n > 0
        ? (this.log.warn(
            `World was loaded with newer version (${r}). Downgrading to ${t.version}.`,
          ),
          t.saveToWorld(),
          this.onDowngrade())
        : this.log.info(`World is up to date with ${t.version}.`),
      this.log.info('FurniturePack is running!'));
  }
  static onUpgrade() {}
  static onDowngrade() {}
  static get() {
    return (
      this._instance || (this._instance = new Vr(bn.github.tag || bn.manifest.bp.version)),
      this._instance
    );
  }
  static compareTo(r) {
    if (!/^v?\d+\.\d+\.\d+$/.test(r)) return -1;
    let t = this.get(),
      [n, o, i] = r
        .replace(/[^0-9.]/g, '')
        .split('.')
        .map(Number),
      [a, u, _] = [t.major, t.minor, t.patch].map(Number);
    return a !== n ? n - a : u !== o ? o - u : _ !== i ? i - _ : 0;
  }
};
((Vr.log = h.getLogger('FurniturePack', 'Version')), d([ue], Vr, 'onWorldLoad', 1));
var wt = Vr,
  Gt = class {
    constructor() {
      this.name = 'xp_furniture:version';
      this.description = 'Displays the current version of the XP Furniture Add-On.';
      this.permissionLevel = ks.Any;
    }
    run(r) {
      let t = `Furniture Pack is running on ${wt.get().version}! (commit: ${bn.github.commit})`;
      return { status: vs.Success, message: t };
    }
  };
(d([m], Gt.prototype, 'run', 1), (Gt = d([To], Gt)));
var ae = class {
  static markBlockTransformed(r, t) {
    let n = this.getBlockKey(r),
      o = {
        type: 'block',
        sourceTypeId: r.typeId,
        targetTypeId: t,
        version: this.currentVersion,
        timestamp: Date.now(),
        location: { x: r.location.x, y: r.location.y, z: r.location.z },
        dimensionId: r.dimension.id,
      };
    (this.saveEntry(n, o),
      this.logger.debug(`Marked block as transformed: ${r.typeId} -> ${t} at ${n}`));
  }
  static markEntityTransformed(r, t) {
    let n = this.getEntityKey(r),
      o = {
        type: 'entity',
        sourceTypeId: r.typeId,
        targetTypeId: t ?? r.typeId,
        version: this.currentVersion,
        timestamp: Date.now(),
        location: { x: r.location.x, y: r.location.y, z: r.location.z },
        dimensionId: r.dimension.id,
      };
    (this.saveEntry(n, o), this.logger.debug(`Marked entity as transformed: ${r.typeId} at ${n}`));
  }
  static isBlockUpToDate(r) {
    let t = this.getBlockKey(r),
      n = this.loadEntry(t);
    return n
      ? n.version !== this.currentVersion
        ? (this.logger.debug(`Block at ${t} is outdated: ${n.version} != ${this.currentVersion}`),
          !1)
        : n.targetTypeId !== r.typeId
          ? (this.logger.debug(
              `Block type mismatch at ${t}: expected ${n.targetTypeId}, found ${r.typeId}`,
            ),
            !1)
          : !0
      : !1;
  }
  static isEntityUpToDate(r) {
    let t = this.getEntityKey(r),
      n = this.loadEntry(t);
    return n
      ? n.version !== this.currentVersion
        ? (this.logger.debug(`Entity at ${t} is outdated: ${n.version} != ${this.currentVersion}`),
          !1)
        : !0
      : !1;
  }
  static untrackBlock(r) {
    let t = this.getBlockKey(r);
    (yr.setDynamicProperty(this.PROPERTY_PREFIX + t, void 0),
      this.cache.delete(t),
      this.logger.debug(`Untracked block at ${t}`));
  }
  static untrackEntity(r) {
    let t = this.getEntityKey(r);
    (yr.setDynamicProperty(this.PROPERTY_PREFIX + t, void 0),
      this.cache.delete(t),
      this.logger.debug(`Untracked entity at ${t}`));
  }
  static clearAll() {
    let r = yr.getDynamicPropertyIds(),
      t = 0;
    for (let n of r) n.startsWith(this.PROPERTY_PREFIX) && (yr.setDynamicProperty(n, void 0), t++);
    (this.cache.clear(),
      (this.cacheLoaded = !1),
      this.logger.info(`Cleared ${t} transformation tracking entries`));
  }
  static getStats() {
    let r = { totalTracked: 0, byType: {}, byVersion: {} };
    for (let t of yr.getDynamicPropertyIds()) {
      if (!t.startsWith(this.PROPERTY_PREFIX)) continue;
      let n = yr.getDynamicProperty(t);
      if (typeof n != 'string') continue;
      try {
        let o = JSON.parse(n),
          i = `${o.sourceTypeId} -> ${o.targetTypeId}`;
        (r.totalTracked++,
          (r.byType[i] = (r.byType[i] || 0) + 1),
          (r.byVersion[o.version] = (r.byVersion[o.version] || 0) + 1));
      } catch {}
    }
    return r;
  }
  static getBlockKey(r) {
    let t = r.location;
    return `${r.dimension.id.replace(/.*:/g, '')}_${t.x}_${t.y}_${t.z}`;
  }
  static getEntityKey(r) {
    let t = r.location;
    return `${r.dimension.id.replace(/.*:/g, '')}_${Math.floor(t.x)}_${Math.floor(t.y)}_${Math.floor(t.z)}`;
  }
  static saveEntry(r, t) {
    let n = this.PROPERTY_PREFIX + r,
      o = JSON.stringify(t);
    try {
      (yr.setDynamicProperty(n, o), this.remember(r, t));
    } catch (i) {
      this.logger.error(`Failed to save transformation entry for ${r}: ${i}`);
    }
  }
  static loadEntry(r) {
    if (this.cache.has(r)) return this.cache.get(r);
    let t = this.PROPERTY_PREFIX + r,
      n = yr.getDynamicProperty(t);
    if (typeof n != 'string' || !n) return null;
    try {
      let o = JSON.parse(n);
      return (this.remember(r, o), o);
    } catch (o) {
      return (this.logger.warn(`Failed to parse transformation entry for ${r}: ${o}`), null);
    }
  }
  static ensureCacheLoaded() {
    if (this.cacheLoaded) return;
    let r = yr.getDynamicPropertyIds(),
      t = 0;
    for (let n of r)
      if (n.startsWith(this.PROPERTY_PREFIX)) {
        let o = n.substring(this.PROPERTY_PREFIX.length),
          i = yr.getDynamicProperty(n);
        if (typeof i == 'string')
          try {
            let a = JSON.parse(i);
            (this.remember(o, a), t++);
          } catch (a) {
            this.logger.warn(`Failed to load entry ${o}: ${a}`);
          }
      }
    ((this.cacheLoaded = !0), this.logger.info(`Loaded ${t} transformation tracking entries`));
  }
  static remember(r, t) {
    (this.cache.delete(r), this.cache.set(r, t));
    if (this.cache.size <= this.CACHE_LIMIT) return;
    let n = this.cache.keys().next().value;
    n !== void 0 && this.cache.delete(n);
  }
};
((ae.logger = h.getLogger('FurniturePack', 'Transformation', 'Tracker')),
  (ae.PROPERTY_PREFIX = 'xp_furniture:transform.'),
  (ae.currentVersion = wt.get().version),
  (ae.CACHE_LIMIT = 2048),
  (ae.cache = new Map()),
  (ae.cacheLoaded = !1));
var $t = h.getLogger('TransformationUtils');
function Pr(e, r = '_v2') {
  try {
    let t = e.typeId.replace(r, '') + r;
    return (e.setType(t), ae.markBlockTransformed(e, t), !0);
  } catch (t) {
    return ($t.error(`Failed to transform ${e.typeId} with suffix ${r}: ${t}`), !1);
  }
}
function xn(e, r) {
  try {
    return (e.setType(r), ae.markBlockTransformed(e, r), !0);
  } catch (t) {
    return ($t.error(`Failed to transform ${e.typeId} to ${r}: ${t}`), !1);
  }
}
function we(e, r) {
  try {
    if (!e || !e.isValid) return !1;
    let t = r
      ? {
          key: ae.getEntityKey(e),
          entry: {
            type: 'entity',
            sourceTypeId: e.typeId,
            targetTypeId: r,
            version: ae.currentVersion,
            timestamp: Date.now(),
            location: { x: e.location.x, y: e.location.y, z: e.location.z },
            dimensionId: e.dimension.id,
          },
        }
      : void 0;
    return (e.remove(), t && ae.saveEntry(t.key, t.entry), !0);
  } catch (t) {
    return ($t.error(`Failed to remove entity: ${t}`), !1);
  }
}
function Nt(e) {
  let r = e.getRotation().y;
  switch (r) {
    case 0:
      return 'north';
    case 90:
      return 'east';
    case -180:
    case 180:
      return 'south';
    case -90:
      return 'west';
    default: {
      let t = Math.round(r / 90) * 90;
      return ys(t);
    }
  }
}
function ys(e) {
  let r = ((e % 360) + 360) % 360;
  return r < 45 || r >= 315
    ? 'north'
    : r >= 45 && r < 135
      ? 'east'
      : r >= 135 && r < 225
        ? 'south'
        : 'west';
}
function Ur(e, r, t, n, o = !0, i) {
  try {
    let a = e.permutation.getAllStates();
    (i && Object.assign(a, i), (a[n] = 0));
    let u = {
        block: { typeId: r, dimension: e.dimension, location: e.location },
        dimension: e.dimension,
        permutationToPlace: Ss.resolve(r, a),
      },
      _ = { params: { size: t, index: n, rotate: o } },
      s = U.handlePlacement(u, _, !0);
    if (!s || s.length === 0)
      return ($t.error('Multiblock transformation failed: no blocks placed'), !1);
    for (let c of s) c && ae.markBlockTransformed(c, r);
    return !0;
  } catch (a) {
    return ($t.error(`Failed to transform to multiblock: ${a}`), !1);
  }
}
function qa(e, r, t = { x: 1, y: 1, z: 1 }, n) {
  let { dimension: o } = e,
    i = f.from(e.location),
    a = new Cs(i.add(t), i.subtract(t)),
    u = [],
    _ = o.getBlocks(a, { includeTypes: [r], includePermutations: n });
  for (let s of _.getBlockLocationIterator()) {
    let c = o.getBlock(s);
    c && u.push(c);
  }
  return u;
}
function za(e) {
  return ae.isBlockUpToDate(e);
}
function Ra(e) {
  return ae.isEntityUpToDate(e);
}
function kt(e, r) {
  return e.dimension.getBlock(e.location)?.typeId === r;
}
var xo = h.getLogger('TransformationDecorators');
function Fa(e, r) {
  return function (t, n, o) {
    let i = o.value;
    if (typeof i != 'function')
      return (
        xo.error(
          `@${e === 'entity' ? 'EntityTransform' : 'BlockTransform'} can only decorate methods`,
        ),
        o
      );
    let a = function (_) {
        if (e === 'entity') {
          let s = _;
          if (Ra(s.entity)) {
            xo.debug(`Skipping transformation for ${s.entity.typeId}: already up-to-date`);
            return !0;
          }
        } else {
          let s = _;
          if (za(s.block)) {
            xo.debug(`Skipping transformation for ${s.block.typeId}: already up-to-date`);
            return !0;
          }
        }
        return i.call(this, _);
      },
      u = {
        sourceTypeId: r.from,
        sourceType: e,
        targetTypeId: r.to,
        transform: a,
        shouldTransform: r.shouldTransform,
        description: r.description,
      };
    return (ie.register(u), o);
  };
}
function re(e) {
  return Fa('entity', e);
}
function wn(e) {
  return Fa('block', e);
}
var Ps = h.getLogger('BarredDoorTransforms'),
  kn = class {
    static transformBarredDoorEntity(r) {
      let { block: t, entity: n } = r,
        o = Nt(n);
      return (
        Ps.debug(`Transforming barred door at ${t.location} with rotation ${o}`),
        Ur(t, 'xp_furniture:barred_door', [2, 3, 1], 'xp_furniture:multiblock_part', !0, {
          'minecraft:cardinal_direction': o,
        })
      );
    }
    static transformBarredDoorCollisionBlock(r) {
      let { block: t } = r,
        n = t.above();
      if (!n || n.typeId !== 'xp_furniture:barred_door') {
        t.setType(te.Air);
        return !0;
      }
      let o = n.permutation;
      return (t.setPermutation(o.withState('xp_furniture:multiblock_part', 0)), !0);
    }
  };
(d(
  [
    re({
      from: 'xp_furniture:barred_door',
      to: 'xp_furniture:barred_door',
      description: 'Remap barred door entity to support multiblock interactions',
      shouldTransform: (r) =>
        r.block.isAir || r.block.typeId === 'xp_furniture:barred_door_collision',
    }),
  ],
  kn,
  'transformBarredDoorEntity',
  1,
),
  d(
    [
      wn({
        from: 'xp_furniture:barred_door_collision',
        to: 'xp_furniture:barred_door',
        description:
          'Replace barred door collision block (inferred from above block) with multiblock part',
      }),
    ],
    kn,
    'transformBarredDoorCollisionBlock',
    1,
  ));
var wo = class {
  static transformCandleHolder(r) {
    let { entity: t, block: n } = r,
      o = n.above(),
      i = [n, o].filter((a) => a && a.typeId === n.typeId);
    if (i.length === 0 || !Pr(i[0], '_v2')) return !1;
    return (i[1]?.setType(te.Air), we(t, 'xp_furniture:candle_holder_v2'));
  }
};
d(
  [
    re({
      from: 'xp_furniture:candle_holder',
      to: 'xp_furniture:candle_holder_v2',
      description: 'Convert v1 candle holder entity to v2 block',
    }),
  ],
  wo,
  'transformCandleHolder',
  1,
);
var ko = class {
  static transformChandelier(r) {
    let { entity: t, block: n } = r;
    return Pr(n, '_v2') && we(t, 'xp_furniture:chandelier_v2');
  }
};
d(
  [
    re({
      from: 'xp_furniture:chandelier',
      to: 'xp_furniture:chandelier_v2',
      description: 'Convert v1 chandelier entity to v2 block',
    }),
  ],
  ko,
  'transformChandelier',
  1,
);
var Ga = h.getLogger('CurtainTransforms'),
  vn = class {
    static transformSingleCurtain(r) {
      let { entity: t, block: n } = r;
      if (!kt(t, 'xp_furniture:curtains')) return !1;
      let o = Nt(t);
      return (
        Ga.debug(`Transforming single curtain at ${n.location} with rotation ${o}`),
        Ur(n, 'xp_furniture:curtains_v2', [1, 2, 1], 'xp_furniture:top_piece_bit', !0, {
          'minecraft:cardinal_direction': o,
          'xp_furniture:is_opened': 0,
        }) && we(t, 'xp_furniture:curtains_v2')
      );
    }
    static transformDoubleCurtain(r) {
      let { entity: t, block: n } = r,
        o = n.typeId;
      if (!o.includes('double')) return !1;
      let i = Nt(t);
      return (
        Ga.debug(`Transforming double curtain at ${n.location} with rotation ${i}`),
        Ur(n, o + '_v2', [2, 2, 1], 'xp_furniture:multiblock_part', !0, {
          'minecraft:cardinal_direction': i,
          'xp_furniture:is_opened': 0,
        }) && we(t, o + '_v2')
      );
    }
  };
(d(
  [
    re({
      from: 'xp_furniture:curtains',
      to: 'xp_furniture:curtains_v2',
      description: 'Convert v1 single curtain entity to v2 multiblock',
    }),
  ],
  vn,
  'transformSingleCurtain',
  1,
),
  d(
    [
      re({
        from: 'xp_furniture:curtains_double',
        to: 'xp_furniture:curtains_double_v2',
        description: 'Convert v1 double curtain entity to v2 multiblock',
      }),
    ],
    vn,
    'transformDoubleCurtain',
    1,
  ));
var vo = class {
  static transformGrowLamp(r) {
    let { entity: t, block: n } = r;
    return xn(n, 'xp_furniture:grow_lamp_v2') && we(t, 'xp_furniture:grow_lamp_v2');
  }
};
d(
  [
    re({
      from: 'xp_furniture:grow_lamp',
      to: 'xp_furniture:grow_lamp_v2',
      description: 'Convert v1 grow lamp entity to v2 block',
    }),
  ],
  vo,
  'transformGrowLamp',
  1,
);
var So = class {
  static transformLamp(r) {
    let { entity: t, block: n } = r;
    return kt(t, 'xp_furniture:lamp') && Pr(n, '_v2') && we(t, 'xp_furniture:lamp_v2');
  }
};
d(
  [
    re({
      from: 'xp_furniture:lamp',
      to: 'xp_furniture:lamp_v2',
      description: 'Convert v1 lamp entity to v2 block',
    }),
  ],
  So,
  'transformLamp',
  1,
);
var Co = class {
  static transformOvergrownGrass(r) {
    let { block: t } = r,
      n = qa(t, 'xp_furniture:overgrown_grass', { x: 1, y: 1, z: 1 });
    return n.length > 0 && n.every((o) => xn(o, 'xp_furniture:overgrown_grass_plains'));
  }
};
d(
  [
    wn({
      from: 'xp_furniture:overgrown_grass',
      to: 'xp_furniture:overgrown_grass_plains',
      description: 'Convert old overgrown grass to plains variant',
    }),
  ],
  Co,
  'transformOvergrownGrass',
  1,
);
var yo = class {
  static transformRockingChair(r) {
    let { entity: t, block: n } = r;
    return (
      t.triggerEvent('xp_furniture:is_interactable'),
      ae.markBlockTransformed(n, n.typeId),
      !0
    );
  }
};
d(
  [
    re({
      from: 'xp_furniture:rocking_chair',
      to: 'xp_furniture:rocking_chair_v2',
      description: 'Convert v1 rocking chair entity to v2 block',
    }),
  ],
  yo,
  'transformRockingChair',
  1,
);
var Po = class {
  static transformStandingLamp(r) {
    let { entity: t, block: n } = r;
    return (
      kt(t, 'xp_furniture:standing_lamp') &&
      Ur(n, 'xp_furniture:standing_lamp_v2', [1, 2, 1], 'xp_furniture:top_piece_bit', !1, {
        'xp_furniture:lit': 0,
      }) &&
      we(t, 'xp_furniture:standing_lamp_v2')
    );
  }
};
d(
  [
    re({
      from: 'xp_furniture:standing_lamp',
      to: 'xp_furniture:standing_lamp_v2',
      description: 'Convert v1 standing lamp entity to v2 multiblock',
    }),
  ],
  Po,
  'transformStandingLamp',
  1,
);
var Eo = class {
  static transformStove(r) {
    let { entity: t, block: n } = r;
    return Pr(n, '_v2') && we(t, 'xp_furniture:stove_v2');
  }
};
d(
  [
    re({
      from: 'xp_furniture:stove',
      to: 'xp_furniture:stove_v2',
      description: 'Convert v1 stove entity to v2 block',
    }),
  ],
  Eo,
  'transformStove',
  1,
);
import { system as Es, TicksPerSecond as Ds, world as Do } from '@minecraft/server';
Do.afterEvents.entityDie.subscribe(
  (e) => {
    let r = e.damageSource.damagingEntity;
    if (!r || r.typeId !== It.Player) return;
    let t = f.from(e.deadEntity.location),
      n = e.deadEntity.dimension,
      o = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < o; i++)
      Es.runTimeout(() => {
        n.spawnEntity(It.XpOrb, t);
      }, 1.25 * Ds);
  },
  { entityTypes: ['xp_furniture:moth', 'xp_furniture:butterfly'] },
);
function $a(e) {
  let r = e.entity,
    t = Ke().enableInsects;
  !r ||
    !r.isValid ||
    (['xp_furniture:moth', 'xp_furniture:butterfly'].includes(r.typeId) && (t || r.remove()));
}
Do.afterEvents.entitySpawn.subscribe($a);
Do.afterEvents.entityLoad.subscribe($a);
import { TicksPerSecond as Bs, world as Na, system as As, GameMode as Ws } from '@minecraft/server';
var Ht = class {
  static init() {
    As.runInterval(() => this.tick(), Bs * 5 + 24e3);
  }
  static tick() {
    if (!Na.gameRules.doMobSpawning) {
      this.log.warn('Cannot spawn: mob spawning is disabled');
      return;
    }
    if (!Ke().enableFurnitureMerchant) {
      this.log.warn('Cannot spawn: merchant spawning is disabled in Settings Block');
      return;
    }
    if (
      Na.getDimension('minecraft:overworld').getEntities({ type: 'xp_furniture:merchant' }).length >
      0
    ) {
      this.log.warn('Cannot spawn: there can only be one merchant at a time in a world');
      return;
    }
    let n = y
      .getAllPlayers()
      .filter(
        (i) =>
          i.dimension.id === 'minecraft:overworld' &&
          i.getGameMode() !== Ws.Spectator &&
          i.dimension.getBlockFromRay(i.location, { x: 0, y: -1, z: 0 }, { maxDistance: 3 }) !==
            void 0,
      );
    if (n.length === 0) {
      this.log.warn('Cannot spawn: no valid players found in the overworld');
      return;
    }
    let o = n[Math.floor(Math.random() * n.length)];
    this.spawn(o);
  }
  static spawn(r) {
    let { location: t, dimension: n } = r,
      o = T.getSeason(),
      i = n.spawnEntity('xp_furniture:merchant', t);
    o === 'halloween'
      ? T.applyToEntity('halloween', i)
      : o === 'christmas' && T.applyToEntity('christmas', i);
    try {
      i.runCommand('spreadplayers ~ ~ 16 32 @s ~');
    } catch {
      this.log.warn('Failed to randomly teleport the merchant via spreadplayers');
    }
    this.log.info(`Spawned at: ${f.from(i.location).toString('short')}, for: ${r.name}`);
  }
};
((Ht.log = h.getLogger('Merchant')), d([ue], Ht, 'init', 1));
import {
  ItemStack as Ls,
  system as inventorySystem,
  TicksPerSecond as inventoryTicks,
  world as inventoryWorld,
} from '@minecraft/server';
var Bo = [
  { from: 'xp_furniture:big_gold_candle_holder', to: 'xp_furniture:big_gold_candle_holder_v2' },
  { from: 'xp_furniture:big_metal_candle_holder', to: 'xp_furniture:big_metal_candle_holder_v2' },
  { from: 'xp_furniture:small_iron_candle_holder', to: 'xp_furniture:small_iron_candle_holder_v2' },
  {
    from: 'xp_furniture:small_metal_candle_holder',
    to: 'xp_furniture:small_metal_candle_holder_v2',
  },
  { from: 'xp_furniture:grow_lamp', to: 'xp_furniture:grow_lamp_v2' },
  { from: 'xp_furniture:acacia_lamp', to: 'xp_furniture:acacia_lamp_v2' },
  { from: 'xp_furniture:bamboo_lamp', to: 'xp_furniture:bamboo_lamp_v2' },
  { from: 'xp_furniture:birch_lamp', to: 'xp_furniture:birch_lamp_v2' },
  { from: 'xp_furniture:cherry_lamp', to: 'xp_furniture:cherry_lamp_v2' },
  { from: 'xp_furniture:crimson_lamp', to: 'xp_furniture:crimson_lamp_v2' },
  { from: 'xp_furniture:dark_oak_lamp', to: 'xp_furniture:dark_oak_lamp_v2' },
  { from: 'xp_furniture:jungle_lamp', to: 'xp_furniture:jungle_lamp_v2' },
  { from: 'xp_furniture:mangrove_lamp', to: 'xp_furniture:mangrove_lamp_v2' },
  { from: 'xp_furniture:oak_lamp', to: 'xp_furniture:oak_lamp_v2' },
  { from: 'xp_furniture:spruce_lamp', to: 'xp_furniture:spruce_lamp_v2' },
  { from: 'xp_furniture:warped_lamp', to: 'xp_furniture:warped_lamp_v2' },
  { from: 'xp_furniture:acacia_standing_lamp', to: 'xp_furniture:acacia_standing_lamp_v2' },
  { from: 'xp_furniture:bamboo_standing_lamp', to: 'xp_furniture:bamboo_standing_lamp_v2' },
  { from: 'xp_furniture:birch_standing_lamp', to: 'xp_furniture:birch_standing_lamp_v2' },
  { from: 'xp_furniture:cherry_standing_lamp', to: 'xp_furniture:cherry_standing_lamp_v2' },
  { from: 'xp_furniture:crimson_standing_lamp', to: 'xp_furniture:crimson_standing_lamp_v2' },
  { from: 'xp_furniture:dark_oak_standing_lamp', to: 'xp_furniture:dark_oak_standing_lamp_v2' },
  { from: 'xp_furniture:jungle_standing_lamp', to: 'xp_furniture:jungle_standing_lamp_v2' },
  { from: 'xp_furniture:mangrove_standing_lamp', to: 'xp_furniture:mangrove_standing_lamp_v2' },
  { from: 'xp_furniture:oak_standing_lamp', to: 'xp_furniture:oak_standing_lamp_v2' },
  { from: 'xp_furniture:spruce_standing_lamp', to: 'xp_furniture:spruce_standing_lamp_v2' },
  { from: 'xp_furniture:warped_standing_lamp', to: 'xp_furniture:warped_standing_lamp_v2' },
  { from: 'xp_furniture:acacia_fence', to: 'xp_furniture:acacia_fence_v2' },
  { from: 'xp_furniture:bamboo_fence', to: 'xp_furniture:bamboo_fence_v2' },
  { from: 'xp_furniture:birch_fence', to: 'xp_furniture:birch_fence_v2' },
  { from: 'xp_furniture:cherry_fence', to: 'xp_furniture:cherry_fence_v2' },
  { from: 'xp_furniture:crimson_fence', to: 'xp_furniture:crimson_fence_v2' },
  { from: 'xp_furniture:dark_oak_fence', to: 'xp_furniture:dark_oak_fence_v2' },
  { from: 'xp_furniture:jungle_fence', to: 'xp_furniture:jungle_fence_v2' },
  { from: 'xp_furniture:mangrove_fence', to: 'xp_furniture:mangrove_fence_v2' },
  { from: 'xp_furniture:oak_fence', to: 'xp_furniture:oak_fence_v2' },
  { from: 'xp_furniture:pale_oak_fence', to: 'xp_furniture:pale_oak_fence_v2' },
  { from: 'xp_furniture:spruce_fence', to: 'xp_furniture:spruce_fence_v2' },
  { from: 'xp_furniture:warped_fence', to: 'xp_furniture:warped_fence_v2' },
  { from: 'xp_furniture:paper_divider', to: 'xp_furniture:paper_divider_v2' },
  { from: 'xp_furniture:woven_divider', to: 'xp_furniture:woven_divider_v2' },
  { from: 'xp_furniture:chandelier', to: 'xp_furniture:chandelier_v2' },
  { from: 'xp_furniture:chandelier_golden', to: 'xp_furniture:chandelier_golden_v2' },
  { from: 'xp_furniture:black_curtain', to: 'xp_furniture:black_curtain_v2' },
  { from: 'xp_furniture:blue_curtain', to: 'xp_furniture:blue_curtain_v2' },
  { from: 'xp_furniture:brown_curtain', to: 'xp_furniture:brown_curtain_v2' },
  { from: 'xp_furniture:cyan_curtain', to: 'xp_furniture:cyan_curtain_v2' },
  { from: 'xp_furniture:gray_curtain', to: 'xp_furniture:gray_curtain_v2' },
  { from: 'xp_furniture:green_curtain', to: 'xp_furniture:green_curtain_v2' },
  { from: 'xp_furniture:light_blue_curtain', to: 'xp_furniture:light_blue_curtain_v2' },
  { from: 'xp_furniture:light_gray_curtain', to: 'xp_furniture:light_gray_curtain_v2' },
  { from: 'xp_furniture:lime_curtain', to: 'xp_furniture:lime_curtain_v2' },
  { from: 'xp_furniture:magenta_curtain', to: 'xp_furniture:magenta_curtain_v2' },
  { from: 'xp_furniture:orange_curtain', to: 'xp_furniture:orange_curtain_v2' },
  { from: 'xp_furniture:pink_curtain', to: 'xp_furniture:pink_curtain_v2' },
  { from: 'xp_furniture:purple_curtain', to: 'xp_furniture:purple_curtain_v2' },
  { from: 'xp_furniture:red_curtain', to: 'xp_furniture:red_curtain_v2' },
  { from: 'xp_furniture:white_curtain', to: 'xp_furniture:white_curtain_v2' },
  { from: 'xp_furniture:yellow_curtain', to: 'xp_furniture:yellow_curtain_v2' },
  { from: 'xp_furniture:black_double_curtain', to: 'xp_furniture:black_double_curtain_v2' },
  { from: 'xp_furniture:blue_double_curtain', to: 'xp_furniture:blue_double_curtain_v2' },
  { from: 'xp_furniture:brown_double_curtain', to: 'xp_furniture:brown_double_curtain_v2' },
  { from: 'xp_furniture:cyan_double_curtain', to: 'xp_furniture:cyan_double_curtain_v2' },
  { from: 'xp_furniture:gray_double_curtain', to: 'xp_furniture:gray_double_curtain_v2' },
  { from: 'xp_furniture:green_double_curtain', to: 'xp_furniture:green_double_curtain_v2' },
  {
    from: 'xp_furniture:light_blue_double_curtain',
    to: 'xp_furniture:light_blue_double_curtain_v2',
  },
  {
    from: 'xp_furniture:light_gray_double_curtain',
    to: 'xp_furniture:light_gray_double_curtain_v2',
  },
  { from: 'xp_furniture:lime_double_curtain', to: 'xp_furniture:lime_double_curtain_v2' },
  { from: 'xp_furniture:magenta_double_curtain', to: 'xp_furniture:magenta_double_curtain_v2' },
  { from: 'xp_furniture:orange_double_curtain', to: 'xp_furniture:orange_double_curtain_v2' },
  { from: 'xp_furniture:pink_double_curtain', to: 'xp_furniture:pink_double_curtain_v2' },
  { from: 'xp_furniture:purple_double_curtain', to: 'xp_furniture:purple_double_curtain_v2' },
  { from: 'xp_furniture:red_double_curtain', to: 'xp_furniture:red_double_curtain_v2' },
  { from: 'xp_furniture:white_double_curtain', to: 'xp_furniture:white_double_curtain_v2' },
  { from: 'xp_furniture:yellow_double_curtain', to: 'xp_furniture:yellow_double_curtain_v2' },
  { from: 'xp_furniture:diorite_small_fountain', to: 'xp_furniture:diorite_small_fountain_v2' },
  { from: 'xp_furniture:metal_small_fountain', to: 'xp_furniture:metal_small_fountain_v2' },
  { from: 'xp_furniture:clover_weeds', to: 'xp_furniture:clover_weeds_item' },
  { from: 'xp_furniture:tall_weeds', to: 'xp_furniture:grass_weeds_item' },
  { from: 'xp_furniture:leafy_plant_1', to: 'xp_furniture:maidenhair_fern_item' },
  { from: 'xp_furniture:plant_monstera', to: 'xp_furniture:monstera_item' },
  { from: 'xp_furniture:leafy_plant_0', to: 'xp_furniture:philodendron_item' },
  { from: 'xp_furniture:small_weeds_cluster', to: 'xp_furniture:small_weeds_cluster_item' },
  { from: 'xp_furniture:cluster_weeds', to: 'xp_furniture:weeds_cluster_item' },
  { from: 'xp_furniture:succulent', to: 'xp_furniture:succulent_item' },
  { from: 'xp_furniture:fern', to: 'xp_furniture:sword_fern_item' },
  { from: 'xp_furniture:big_plant_spiky', to: 'xp_furniture:big_plant_spiky_item' },
  { from: 'xp_furniture:blazing_star', to: 'xp_furniture:blazing_star_item' },
  { from: 'xp_furniture:butterflower_cluster', to: 'xp_furniture:butterflower_cluster_item' },
  { from: 'xp_furniture:butterfly_milkweed', to: 'xp_furniture:butterfly_milkweed_item' },
  { from: 'xp_furniture:duckweed', to: 'xp_furniture:duckweed_item' },
  { from: 'xp_furniture:flower_cluster_0', to: 'xp_furniture:flower_cluster_0_item' },
  { from: 'xp_furniture:flower_cluster_1', to: 'xp_furniture:flower_cluster_1_item' },
  { from: 'xp_furniture:flower_cluster_2', to: 'xp_furniture:flower_cluster_2_item' },
  { from: 'xp_furniture:flower_cluster_3', to: 'xp_furniture:flower_cluster_3_item' },
  {
    from: 'xp_furniture:hanging_golden_chain_leaves',
    to: 'xp_furniture:hanging_golden_chain_leaves_item',
  },
  {
    from: 'xp_furniture:hanging_golden_chain_vines',
    to: 'xp_furniture:hanging_golden_chain_vines_item',
  },
  { from: 'xp_furniture:hanging_wisteria_leaves', to: 'xp_furniture:hanging_wisteria_leaves_item' },
  { from: 'xp_furniture:hanging_wisteria_vines', to: 'xp_furniture:hanging_wisteria_vines_item' },
  { from: 'xp_furniture:ivy', to: 'xp_furniture:ivy_item' },
  { from: 'xp_furniture:ivy_white', to: 'xp_furniture:ivy_item_white' },
  { from: 'xp_furniture:ivy_purple', to: 'xp_furniture:ivy_item_purple' },
  { from: 'xp_furniture:lotus_lilypad_pink', to: 'xp_furniture:lotus_lilypad_pink_item' },
  { from: 'xp_furniture:lotus_lilypad_purple', to: 'xp_furniture:lotus_lilypad_purple_item' },
  { from: 'xp_furniture:lotus_lilypad_white', to: 'xp_furniture:lotus_lilypad_white_item' },
  { from: 'xp_furniture:mossy_pebbles', to: 'xp_furniture:mossy_pebbles_item' },
  { from: 'xp_furniture:mushroom_cluster', to: 'xp_furniture:mushroom_cluster_item' },
  { from: 'xp_furniture:pebbles', to: 'xp_furniture:pebbles_item' },
  { from: 'xp_furniture:small_cluster_lily_pad', to: 'xp_furniture:small_cluster_lily_pad_item' },
  { from: 'xp_furniture:bell_pepper_block', to: 'xp_furniture:bell_pepper_seed' },
  { from: 'xp_furniture:cabbage_block', to: 'xp_furniture:cabbage_seed' },
  { from: 'xp_furniture:corn_block', to: 'xp_furniture:corn_seed' },
  { from: 'xp_furniture:corn_block_top', to: 'xp_furniture:corn_seed' },
  { from: 'xp_furniture:eggplant_block', to: 'xp_furniture:eggplant_seed' },
  { from: 'xp_furniture:tomato_block', to: 'xp_furniture:tomato_seed' },
  { from: 'xp_furniture:spooky_cobweb', to: 'xp_furniture:spooky_cobweb_item' },
  { from: 'xp_furniture:barred_door_collision', to: 'xp_furniture:barred_door' },
  { from: 'xp_furniture:standing_camera', to: 'xp_furniture:standing_camera_v2' },
  { from: 'xp_furniture:black_big_cauldron', to: 'xp_furniture:black_big_cauldron_v2' },
  { from: 'xp_furniture:copper_big_cauldron', to: 'xp_furniture:copper_big_cauldron_v2' },
  { from: 'xp_furniture:metal_big_cauldron', to: 'xp_furniture:metal_big_cauldron_v2' },
  { from: 'xp_furniture:acacia_hanging_item_sign', to: 'xp_furniture:acacia_hanging_item_sign_v2' },
  { from: 'xp_furniture:bamboo_hanging_item_sign', to: 'xp_furniture:bamboo_hanging_item_sign_v2' },
  { from: 'xp_furniture:birch_hanging_item_sign', to: 'xp_furniture:birch_hanging_item_sign_v2' },
  { from: 'xp_furniture:cherry_hanging_item_sign', to: 'xp_furniture:cherry_hanging_item_sign_v2' },
  {
    from: 'xp_furniture:crimson_hanging_item_sign',
    to: 'xp_furniture:crimson_hanging_item_sign_v2',
  },
  {
    from: 'xp_furniture:dark_oak_hanging_item_sign',
    to: 'xp_furniture:dark_oak_hanging_item_sign_v2',
  },
  { from: 'xp_furniture:jungle_hanging_item_sign', to: 'xp_furniture:jungle_hanging_item_sign_v2' },
  {
    from: 'xp_furniture:mangrove_hanging_item_sign',
    to: 'xp_furniture:mangrove_hanging_item_sign_v2',
  },
  { from: 'xp_furniture:oak_hanging_item_sign', to: 'xp_furniture:oak_hanging_item_sign_v2' },
  { from: 'xp_furniture:spruce_hanging_item_sign', to: 'xp_furniture:spruce_hanging_item_sign_v2' },
  { from: 'xp_furniture:warped_hanging_item_sign', to: 'xp_furniture:warped_hanging_item_sign_v2' },
  {
    from: 'xp_furniture:pale_oak_hanging_item_sign',
    to: 'xp_furniture:pale_oak_hanging_item_sign_v2',
  },
  { from: 'xp_furniture:juice_barrel', to: 'xp_furniture:juice_barrel_v2' },
  { from: 'xp_furniture:acacia_rocking_chair', to: 'xp_furniture:acacia_rocking_chair_v2' },
  { from: 'xp_furniture:bamboo_rocking_chair', to: 'xp_furniture:bamboo_rocking_chair_v2' },
  { from: 'xp_furniture:birch_rocking_chair', to: 'xp_furniture:birch_rocking_chair_v2' },
  { from: 'xp_furniture:cherry_rocking_chair', to: 'xp_furniture:cherry_rocking_chair_v2' },
  { from: 'xp_furniture:crimson_rocking_chair', to: 'xp_furniture:crimson_rocking_chair_v2' },
  { from: 'xp_furniture:dark_oak_rocking_chair', to: 'xp_furniture:dark_oak_rocking_chair_v2' },
  { from: 'xp_furniture:jungle_rocking_chair', to: 'xp_furniture:jungle_rocking_chair_v2' },
  { from: 'xp_furniture:mangrove_rocking_chair', to: 'xp_furniture:mangrove_rocking_chair_v2' },
  { from: 'xp_furniture:oak_rocking_chair', to: 'xp_furniture:oak_rocking_chair_v2' },
  { from: 'xp_furniture:spruce_rocking_chair', to: 'xp_furniture:spruce_rocking_chair_v2' },
  { from: 'xp_furniture:warped_rocking_chair', to: 'xp_furniture:warped_rocking_chair_v2' },
  { from: 'xp_furniture:pale_oak_rocking_chair', to: 'xp_furniture:pale_oak_rocking_chair_v2' },
  { from: 'xp_furniture:blackstone_stove', to: 'xp_furniture:blackstone_stove_v2' },
  { from: 'xp_furniture:copper_stove', to: 'xp_furniture:copper_stove_v2' },
  { from: 'xp_furniture:iron_stove', to: 'xp_furniture:iron_stove_v2' },
  { from: 'xp_furniture:stone_stove', to: 'xp_furniture:stone_stove_v2' },
  { from: 'xp_furniture:wood_mug', to: 'xp_furniture:wood_mug_drink' },
  { from: 'xp_furniture:wood_mug_full', to: 'xp_furniture:wood_mug_drink_full' },
  { from: 'xp_furniture:wood_mug_cocoa', to: 'xp_furniture:wood_mug_drink_cocoa' },
  { from: 'xp_furniture:christmas_tree', to: 'xp_furniture:christmas_tree_item' },
  {
    from: 'xp_furniture:golden_chain_leaves_hanging_top',
    to: 'xp_furniture:golden_chain_leaves_hanging',
  },
  {
    from: 'xp_furniture:golden_chain_leaves_hanging_bottom',
    to: 'xp_furniture:golden_chain_leaves_hanging',
  },
  {
    from: 'xp_furniture:hanging_golden_chain_leaves_item',
    to: 'xp_furniture:golden_chain_leaves_hanging',
  },
  {
    from: 'xp_furniture:hanging_golden_chain_vines_item',
    to: 'xp_furniture:golden_chain_leaves_hanging',
  },
  { from: 'xp_furniture:wisteria_leaves_hanging_top', to: 'xp_furniture:wisteria_leaves_hanging' },
  {
    from: 'xp_furniture:wisteria_leaves_hanging_bottom',
    to: 'xp_furniture:wisteria_leaves_hanging',
  },
  { from: 'xp_furniture:hanging_wisteria_leaves_item', to: 'xp_furniture:wisteria_leaves_hanging' },
  { from: 'xp_furniture:hanging_wisteria_vines_item', to: 'xp_furniture:wisteria_leaves_hanging' },
  { from: 'xp_furniture:willow_leaves_hanging_top', to: 'xp_furniture:willow_leaves_hanging' },
  { from: 'xp_furniture:willow_leaves_hanging_bottom', to: 'xp_furniture:willow_leaves_hanging' },
  { from: 'xp_furniture:hanging_willow_leaves_item', to: 'xp_furniture:willow_leaves_hanging' },
  { from: 'xp_furniture:hanging_willow_vines_item', to: 'xp_furniture:willow_leaves_hanging' },
];
var legacyItemMappings = new Map(Bo.map((e) => [e.from, e.to])),
  hammerLore = [
    '',
    { rawtext: [{ text: '\xA7r' }, { translate: 'xp_furniture:hammer.tooltip.line1' }] },
    { rawtext: [{ text: '\xA7r' }, { translate: 'xp_furniture:hammer.tooltip.line2' }] },
    { rawtext: [{ text: '\xA7r' }, { translate: 'xp_furniture:hammer.tooltip.line3' }] },
  ],
  expectedHammerRawLore = [
    { text: '' },
    { rawtext: [{ text: '\xA7r' }, { translate: 'xp_furniture:hammer.tooltip.line1' }] },
    { rawtext: [{ text: '\xA7r' }, { translate: 'xp_furniture:hammer.tooltip.line2' }] },
    { rawtext: [{ text: '\xA7r' }, { translate: 'xp_furniture:hammer.tooltip.line3' }] },
  ];
var Ha = h.getLogger('FurniturePack', 'Items', 'Item Association'),
  Qa = [],
  Sn = class {
    static hasExpectedHammerLore(r) {
      try {
        let t = r.getRawLore();
        if (t.length !== expectedHammerRawLore.length || t[0]?.text !== '') return !1;
        for (let n = 1; n < expectedHammerRawLore.length; n++) {
          let o = t[n]?.rawtext;
          if (
            !Array.isArray(o) ||
            o[0]?.text !== '\xA7r' ||
            o[1]?.translate !== `xp_furniture:hammer.tooltip.line${n}`
          )
            return !1;
        }
        return !0;
      } catch {
        return !1;
      }
    }
    static setInventoryItem(r, t, n) {
      y.getInventoryComponent(r)?.container?.setItem(t, n);
    }
    static maintainSlot(r, t) {
      if (!r?.isValid) return;
      let n = y.getInventoryComponent(r)?.container;
      if (!n || t < 0 || t >= n.size) return;
      let o = n.getItem(t);
      if (!o) return;
      let i = legacyItemMappings.get(o.typeId);
      if (i && !Qa.includes(o.typeId))
        try {
          (this.setInventoryItem(r, t, new Ls(i, o.amount)),
            Ha.info(`${r.name} - replaced ${o.typeId} with ${i}`));
        } catch {
          (Ha.warn(
            `Failed to replace item ${o.typeId} with ${i} -- ensure that the item exists in the game.`,
          ),
            Qa.push(o.typeId));
        }
      else if (o.typeId === 'xp_furniture:hammer' && !this.hasExpectedHammerLore(o)) {
        (o.setLore(hammerLore), this.setInventoryItem(r, t, o));
      }
    }
    static main(r) {
      if (!r?.isValid) return;
      let t = y.getInventoryComponent(r)?.container;
      if (!t) return;
      for (let n = 0; n < t.size; n++) this.maintainSlot(r, n);
    }
    static scheduleScan(r) {
      scheduleInventoryMaintenanceScan(r);
    }
    static init() {
      (inventoryWorld.afterEvents.playerInventoryItemChange.subscribe((r) => {
        this.scheduleScan(r.player);
      }),
        inventoryWorld.afterEvents.playerSpawn.subscribe((r) => {
          inventorySystem.runTimeout(() => this.main(r.player), 1);
        }),
        inventoryWorld.afterEvents.playerLeave.subscribe((r) =>
          inventoryMaintenanceScans.delete(r.playerId),
        ),
        inventorySystem.runInterval(() => {
          for (let r of y.getAllPlayers()) this.main(r);
        }, this.FALLBACK_INTERVAL));
    }
  };
Sn.FALLBACK_INTERVAL = inventoryTicks * 30;
d([ue], Sn, 'init', 1);
import {
  Block as qs,
  BlockStates as zs,
  Entity as Rs,
  EntityComponentTypes as Fs,
  EquipmentSlot as Gs,
  GameMode as $s,
  ItemStack as Ns,
  Player as Hs,
} from '@minecraft/server';
var pe = class {
  static onHit(r) {
    let t = r.damagingEntity;
    if (
      !t ||
      !(t instanceof Hs) ||
      !(y.getEquippableComponent(t)?.getEquipment(Gs.Mainhand)?.typeId === 'xp_furniture:hammer')
    )
      return;
    let o = 'hitBlock' in r ? r.hitBlock : r.hitEntity,
      i = o.typeId;
    if (i.startsWith('xp_furniture:')) {
      if (o instanceof qs)
        (o.dimension.runCommand(
          `setblock ${f.from(o.location).toBlockLocation().toString('short', ' ')} air destroy`,
        ),
          this.excludeBlocksDrop.includes(i)
            ? this.log.info(`Block ${i} removed without manually checking for drop item (excluded)`)
            : this.dropBlockItem(o, 'hitBlockPermutation' in r ? r.hitBlockPermutation : void 0),
          this.log.info(`Hit block: ${i}`));
      else if (o instanceof Rs) {
        let a = ['xp_furniture:despawn', 'xp_furniture:instant_despawn'];
        (D.invokeEvents(o, a), this.log.info(`Hit entity: ${i}`));
      }
    }
  }
  static dropBlockItem(r, t) {
    let { typeId: n, dimension: o, location: i } = r,
      a = !1,
      u = o.getEntitiesAtBlockLocation(i);
    for (let _ of u) {
      if (_.typeId !== 'minecraft:item') continue;
      let s = _.getComponent(Fs.Item)?.itemStack;
      if (s && s.typeId.startsWith('xp_furniture:')) {
        ((a = !0), this.log.info(`Item dropped from block: ${s.typeId}`));
        break;
      }
    }
    if (!a) {
      let _ = t?.getItemStack();
      if (!_)
        try {
          _ = new Ns(n, 1);
        } catch {
          return;
        }
      (r.dimension.spawnItem(_, i), this.log.info(`No loot from block, manually dropped: ${n}`));
    }
  }
  static inflictDmg(r) {}
  onUseOn(r) {
    let { block: t, usedOnBlockPermutation: n, source: o } = r,
      i = n.getAllStates(),
      a = Object.keys(i).filter((s) => !pe.excludeProperties.includes(s));
    if (a.length === 0) return;
    let u = o;
    if (!t.typeId.startsWith('xp_furniture:') && u.getGameMode() !== $s.Creative) return;
    let _ = u.getDynamicProperty('xp_furniture:hammer_punch');
    if (
      ((!_ || !a.includes(_)) && ((_ = a[0]), u.setDynamicProperty('xp_furniture:hammer_punch', _)),
      u.isSneaking)
    ) {
      let c = (a.indexOf(_) + 1) % a.length;
      ((_ = a[c]),
        u.setDynamicProperty('xp_furniture:hammer_punch', _),
        u.onScreenDisplay.setActionBar({
          translate: 'xp_furniture:hammer.action.key',
          with: [_.replace(/.+:/gm, '')],
        }),
        u.playSound('random.click', { pitch: 1.25, volume: 0.75 }));
    } else {
      let s = zs.get(_)?.validValues ?? [],
        c = i[_],
        p = s.indexOf(c);
      p === -1 && (p = s.indexOf(c === 1));
      let w = (p + 1) % s.length,
        C = n.getAllStates();
      C[_] = s[w];
      let P = !0;
      try {
        t.setPermutation(Q(t.typeId, C));
      } catch (F) {
        ((P = !1), pe.log.info(F, C));
      }
      if (!P) return;
      let O = (F) =>
        typeof F == 'boolean'
          ? F
            ? '\xA7a是\xA7r'
            : '\xA7c否\xA7r'
          : typeof F == 'number'
            ? `\xA73${F}\xA7r`
            : `\xA7e${F}\xA7r`;
      (u.onScreenDisplay.setActionBar({
        translate: 'xp_furniture:hammer.action.value',
        with: { rawtext: [{ text: _.replace(/.+:/gm, '') }, { text: O(s[w]) }] },
      }),
        u.playSound('random.click', { pitch: 1.25, volume: 0.75 }));
    }
  }
};
((pe.componentId = 'xp_furniture:hammer'),
  (pe.log = h.getLogger('FurniturePack', 'Hammer')),
  (pe.excludeProperties = ['xp_furniture:is_placed', 'xp_furniture:multiblock_part']),
  (pe.excludeBlocksDrop = [
    'xp_furniture:basket',
    'xp_furniture:apple_basket',
    'xp_furniture:carrot_basket',
    'xp_furniture:potato_basket',
  ]),
  d([m], pe.prototype, 'onUseOn', 1),
  d([ni, Et], pe, 'onHit', 1),
  d([Et], pe, 'inflictDmg', 1),
  (pe = d([Zt], pe)));
import { world as Qs } from '@minecraft/server';
var vt = class {
  static give(r) {
    !r ||
      !r.isValid ||
      (this.structureManager || (this.structureManager = Qs.structureManager),
      this.structureManager.place('xp_furniture:furniture_guide_book', r.dimension, r.location, {
        includeBlocks: !1,
      }),
      this.log.info(`Given to: ${r.name}`));
  }
  static replaceGuideBookForPlayer(r) {
    if (
      !r?.isValid ||
      this.pendingPlayers.has(r.id) ||
      W.getHeldItem(r)?.typeId !== 'xp_furniture:guide_book'
    )
      return;
    (this.pendingPlayers.add(r.id),
      W.decrementStack(r, 'xp_furniture:guide_book', !0),
      this.give(r),
      inventorySystem.runTimeout(() => this.pendingPlayers.delete(r.id), 2));
  }
  static replaceGuideBookItem() {
    (Qs.afterEvents.playerHotbarSelectedSlotChange.subscribe((r) => {
      this.replaceGuideBookForPlayer(r.player);
    }),
      Qs.afterEvents.playerInventoryItemChange.subscribe((r) => {
        this.replaceGuideBookForPlayer(r.player);
      }),
      Qs.afterEvents.playerLeave.subscribe((r) => this.pendingPlayers.delete(r.playerId)),
      inventorySystem.runInterval(() => {
        for (let r of y.getAllPlayers()) this.replaceGuideBookForPlayer(r);
      }, inventoryTicks * 2));
  }
  static onPlayerSpawn(r) {
    let { initialSpawn: t, player: n } = r;
    t &&
      (n.removeTag('xp_furniture_guide_book_given'),
      n.getDynamicProperty('xp_furniture:has_guide_book_given') ||
        (this.give(n), n.setDynamicProperty('xp_furniture:has_guide_book_given', !0)),
      inventorySystem.runTimeout(() => this.replaceGuideBookForPlayer(n), 1));
  }
};
((vt.log = h.getLogger('GuideBook')),
  (vt.pendingPlayers = new Set()),
  d([ue], vt, 'replaceGuideBookItem', 1),
  d([Tt], vt, 'onPlayerSpawn', 1));
import { BlockPermutation as js, system as Vs, world as Us } from '@minecraft/server';
var Js = h.getLogger('FurniturePack', 'Items', 'Lilypads'),
  ja = [
    { id: 'xp_furniture:duckweed', allowLandPlacement: !0 },
    'xp_furniture:lotus_lilypad_pink_item',
    'xp_furniture:lotus_lilypad_purple_item',
    'xp_furniture:lotus_lilypad_white_item',
    'xp_furniture:small_cluster_lily_pad_item',
  ];
Us.beforeEvents.playerInteractWithBlock.subscribe((e) => {
  let { block: r, player: t, itemStack: n } = e;
  if (
    !n ||
    !ja.some((a) =>
      typeof a == 'string'
        ? r.permutation.matches('minecraft:water') && n.typeId.includes(a)
        : typeof a == 'object'
          ? a.allowLandPlacement
            ? n.typeId.includes(a.id) && (r.permutation.matches('minecraft:water') || Ys(r))
            : r.permutation.matches('minecraft:water') && n.typeId.includes(a.id)
          : !1,
    )
  )
    return;
  Js.info(
    n.typeId,
    r.getItemStack()?.typeId || 'unknown',
    r?.dimension.getBlock(r?.above())?.permutation.matches('minecraft:water'),
  );
  let o = r.above(
      ja.some((a) => typeof a == 'object' && n.typeId.includes(a.id) && a.allowLandPlacement) &&
        r?.dimension.getBlock(r?.above())?.permutation.matches('minecraft:water')
        ? 2
        : 1,
    ),
    i = y.getPlayerCardinalDirection(t);
  if (!o || !o.isAir) {
    e.cancel = !0;
    return;
  }
  Vs.run(() => {
    o.setPermutation(
      js.resolve(n.typeId.replace('_item', ''), (n.typeId, { 'xp_furniture:direction': i })),
    );
    let a = r.above();
    a && a.dimension.playSound('dig.grass', a.location);
  });
});
var Xs = [te.Podzol, te.DirtWithRoots, te.MossBlock, 'xp_furniture:wet_dirt'];
function Ys(e) {
  let r = e.getTags();
  return !r.includes('grass') || !r.includes('dirt') ? !!Xs.includes(e.typeId) : !0;
}
import { world as Ks, TicksPerSecond as Ao } from '@minecraft/server';
var Wo = ['xp_furniture:chilipepper', 'xp_furniture:salad'];
Ks.afterEvents.itemCompleteUse.subscribe((e) => {
  let r = e.itemStack.typeId;
  if (!Wo.includes(r)) return;
  let t = e.source;
  switch (r) {
    case Wo[0]:
      (t.addEffect('nausea', 7 * Ao, { amplifier: 2 }), t.addEffect('fire_resistance', 30 * Ao));
      break;
    case Wo[1]:
      t.addEffect('regeneration', 2 * Ao, { amplifier: 2 });
      break;
    default:
      break;
  }
});
import { system as Oo, TicksPerSecond as St, world as Lo } from '@minecraft/server';
var m1 = h.getLogger('Instruments'),
  Va = ((t) => ((t.Ukulele = 'xp_furniture:ukulele'), (t.Panflute = 'xp_furniture:panflute'), t))(
    Va || {},
  ),
  Zs = [
    {
      id: 'xp_furniture:song.ukulele_1',
      duration: Math.round(11.71 * St),
      instrument: 'xp_furniture:ukulele',
    },
    {
      id: 'xp_furniture:song.ukulele_2',
      duration: Math.round(8.78 * St),
      instrument: 'xp_furniture:ukulele',
    },
    {
      id: 'xp_furniture:song.ukulele_3',
      duration: Math.round(8.78 * St),
      instrument: 'xp_furniture:ukulele',
    },
  ],
  Is = [
    {
      id: 'xp_furniture:song.flute_1',
      duration: Math.round(12.75 * St),
      instrument: 'xp_furniture:panflute',
    },
    { id: 'xp_furniture:song.flute_2', duration: 9 * St, instrument: 'xp_furniture:panflute' },
    {
      id: 'xp_furniture:song.flute_3',
      duration: Math.round(10.88 * St),
      instrument: 'xp_furniture:panflute',
    },
  ],
  qo = Object.values(Va),
  Ts = {
    'xp_furniture:ukulele': 'animation.xp_furniture.ukulele.play.player',
    'xp_furniture:panflute': 'animation.xp_furniture.humanoid.panflute_play_tp',
  },
  Ua = {
    'xp_furniture:ukulele': 'animation.xp_furniture.ukulele.wield_tp',
    'xp_furniture:panflute': 'animation.xp_furniture.panflute.wield_tp',
  },
  zo = `!q.is_item_name_any('slot.weapon.mainhand', 0, ${qo.map((e) => `'${e}'`).join(', ')})`,
  Qt = new Map(),
  heldInstrumentAnimations = new Map();
function stopInstrumentSession(e, r, t = !0) {
  let n = Qt.get(e);
  if (n === void 0) return;
  (Oo.clearRun(n.runId), Qt.delete(e));
  if (!r?.isValid) {
    heldInstrumentAnimations.delete(e);
    return;
  }
  (r.runCommand(`stopsound @a[r=12] ${n.song.id}`),
    t &&
      r.playAnimation(Ua[n.song.instrument], {
        nextState: 'idle',
        blendOutTime: 0.1,
        stopExpression: zo,
      }),
    t ? heldInstrumentAnimations.set(e, n.song.instrument) : heldInstrumentAnimations.delete(e));
}
Lo.afterEvents.itemStartUse.subscribe((e) => {
  let { source: r, itemStack: t } = e;
  if (Qt.get(r.id) !== void 0) return;
  let o = qo.find((s) => t.matches(s));
  if (!o) return;
  let i = Ts[o],
    a;
  switch (o) {
    case 'xp_furniture:ukulele':
      a = Zs[Math.floor(Math.random() * 3)];
      break;
    case 'xp_furniture:panflute':
      a = Is[Math.floor(Math.random() * 3)];
      break;
  }
  let u = () => {
    if (!r.isValid) {
      stopInstrumentSession(r.id);
      return;
    }
    r.dimension.playSound(a.id, r.location, { volume: 4 });
  };
  u();
  let _ = Oo.runInterval(u, a.duration);
  (heldInstrumentAnimations.delete(r.id),
    Qt.set(r.id, { song: a, runId: _ }),
    r.playAnimation(i, {
      nextState: 'idle',
      blendOutTime: 0.15,
      stopExpression: `${zo} || !q.is_using_item || v.is_first_person == 1.0`,
    }));
});
Lo.afterEvents.itemStopUse.subscribe((e) => {
  stopInstrumentSession(e.source.id, e.source);
});
Lo.afterEvents.playerLeave.subscribe((e) => {
  (stopInstrumentSession(e.playerId), heldInstrumentAnimations.delete(e.playerId));
});
Oo.runInterval(() => {
  let livePlayers = new Map(),
    players = Lo.getAllPlayers();
  for (let e of players) {
    if (!e.isValid) continue;
    livePlayers.set(e.id, e);
  }
  for (let r of players) {
    if (!r.isValid || Qt.has(r.id)) continue;
    let t = W.getHeldItem(r);
    if (!t) {
      heldInstrumentAnimations.delete(r.id);
      continue;
    }
    let n = qo.find((o) => t.matches(o));
    if (!n) {
      heldInstrumentAnimations.delete(r.id);
      continue;
    }
    if (heldInstrumentAnimations.get(r.id) === n) continue;
    let i = Ua[n];
    (r.playAnimation(i, { nextState: 'idle', blendOutTime: 0.1, stopExpression: zo }),
      heldInstrumentAnimations.set(r.id, n));
  }
  for (let [r, t] of Qt) {
    let n = livePlayers.get(r),
      o = n && W.getHeldItem(n);
    (!n || !o?.matches(t.song.instrument)) && stopInstrumentSession(r, n);
  }
  for (let r of heldInstrumentAnimations.keys())
    livePlayers.has(r) || heldInstrumentAnimations.delete(r);
}, 5);
Math.clamp = function (e, r, t) {
  return Math.min(Math.max(e, r), t);
};
Math.lerp = function (e, r, t) {
  return e + (r - e) * t;
};
Math.in_range = function (e, r, t) {
  return e >= r && e <= t;
};
Math.withinRange = function (e, r) {
  let t = r - e;
  return e + Math.random() * t;
};
Math.integerWithinRange = function (e, r) {
  return Math.round(Math.withinRange(e, r));
};
Math.chooseFromArray = function (e) {
  return e[Math.floor(Math.random() * e.length)];
};
Math.stringID = function (e = 10) {
  let r = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    t = '';
  for (let n = 0; n < e; n++) t += r.charAt(Math.floor(Math.random() * r.length));
  return t;
};
import { system as ud } from '@minecraft/server';
import { system as Ms } from '@minecraft/server';
import { system as Ja } from '@minecraft/server';
var Xa = 2047,
  Ro = 1,
  Cn = '',
  yn = '';
function Ya(e, r, t) {
  return `${`${e.version}|${e.encoding}`}${Cn}${r}${yn}${t}`;
}
function ed(e) {
  return `${`${e.version}|${e.encoding}`}${Cn}${yn}`.length;
}
function rd() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (e) => {
    let r = (Math.random() * 16) | 0;
    return (e === 'x' ? r : (r & 3) | 8).toString(16);
  });
}
function td(e) {
  let r = e.replace(/-/g, '');
  if (r.length !== 32) throw new Error(`Invalid UUID: expected 36 chars with hyphens, got "${e}"`);
  let t = new Uint8Array(16);
  for (let n = 0; n < 16; n++) t[n] = parseInt(r.substr(n * 2, 2), 16);
  return t;
}
function nd(e) {
  if (e.length !== 16) throw new Error(`Invalid byte array: expected length 16, got ${e.length}`);
  return Array.from(e, (t) => t.toString(16).padStart(2, '0')).join('');
}
var od = class {
    constructor() {
      g(this, 'encoding', 'text');
    }
    encode(e) {
      return JSON.stringify(e);
    }
    encodeHeader(e) {
      let r = [e.id];
      return (
        e.frag !== void 0 &&
          e.last !== void 0 &&
          r.push(e.frag.toString(), (e.last ? 1 : 0).toString()),
        r.join('|')
      );
    }
    decode(e) {
      try {
        return JSON.parse(e);
      } catch {
        return null;
      }
    }
    decodeHeader(e) {
      let r = e.split('|'),
        n = { id: r[0] };
      if (r.length === 3) {
        let o = parseInt(r[1], 10),
          i = parseInt(r[2], 10);
        if (!Number.isInteger(o) || o < 0 || (i !== 0 && i !== 1)) return null;
        ((n.frag = o), (n.last = i === 1));
      } else if (r.length !== 1) return null;
      return n;
    }
  },
  ee,
  Ct =
    ((ee = class {
      static utf8Encode(r) {
        let t = [];
        for (let n of r) {
          let o = n.codePointAt(0);
          o <= 127
            ? t.push(o)
            : o <= 2047
              ? t.push(192 | (o >> 6), 128 | (o & 63))
              : o <= 65535
                ? t.push(224 | (o >> 12), 128 | ((o >> 6) & 63), 128 | (o & 63))
                : t.push(
                    240 | (o >> 18),
                    128 | ((o >> 12) & 63),
                    128 | ((o >> 6) & 63),
                    128 | (o & 63),
                  );
        }
        return new Uint8Array(t);
      }
      static utf8Decode(r) {
        let t = '';
        for (let n = 0; n < r.length; ) {
          let o = r[n++];
          if (o < 128) t += String.fromCodePoint(o);
          else if (o < 224) {
            let i = r[n++];
            t += String.fromCodePoint(((o & 31) << 6) | (i & 63));
          } else if (o < 240) {
            let i = r[n++],
              a = r[n++];
            t += String.fromCodePoint(((o & 15) << 12) | ((i & 63) << 6) | (a & 63));
          } else {
            let i = r[n++],
              a = r[n++],
              u = r[n++];
            t += String.fromCodePoint(
              ((o & 7) << 18) | ((i & 63) << 12) | ((a & 63) << 6) | (u & 63),
            );
          }
        }
        return t;
      }
      static encodeBytes(r) {
        let t = '',
          n = 0;
        for (; n < r.length; ) {
          let o = r[n++] ?? NaN,
            i = r[n++] ?? NaN,
            a = r[n++] ?? NaN,
            u = o >> 2,
            _ = ((o & 3) << 4) | (i >> 4),
            s = isNaN(i) ? 64 : ((i & 15) << 2) | (a >> 6),
            c = isNaN(a) ? 64 : a & 63;
          ((t += ee._alphabet.charAt(u)),
            (t += ee._alphabet.charAt(_)),
            (t += s === 64 ? ee._pad : ee._alphabet.charAt(s)),
            (t += c === 64 ? ee._pad : ee._alphabet.charAt(c)));
        }
        return t;
      }
      static decodeToBytes(r) {
        r = r.replace(/[^A-Za-z0-9+/=]/g, '');
        let t = (r.length / 4) * 3 - (r.endsWith('==') ? 2 : r.endsWith('=') ? 1 : 0),
          n = new Uint8Array(t),
          o = 0,
          i = 0;
        for (; i < r.length; ) {
          let a = ee._alphabet.indexOf(r.charAt(i++)),
            u = ee._alphabet.indexOf(r.charAt(i++)),
            _ = ee._alphabet.indexOf(r.charAt(i++)),
            s = ee._alphabet.indexOf(r.charAt(i++)),
            c = (a << 2) | (u >> 4),
            p = ((u & 15) << 4) | (_ >> 2),
            w = ((_ & 3) << 6) | s;
          ((n[o++] = c), _ !== 64 && o < t && (n[o++] = p), s !== 64 && o < t && (n[o++] = w));
        }
        return n;
      }
      static encode(r) {
        let t = ee.utf8Encode(r);
        return ee.encodeBytes(t);
      }
      static decode(r) {
        let t = ee.decodeToBytes(r);
        return ee.utf8Decode(t);
      }
      static createOutputStream() {
        return new Ka();
      }
      static createInputStream(r) {
        return new Za(r);
      }
    }),
    g(ee, '_alphabet', 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'),
    g(ee, '_pad', '='),
    ee),
  Ka = class {
    constructor() {
      g(this, '_buf', []);
    }
    get length() {
      return this._buf.length;
    }
    writeBytes(e) {
      for (let r = 0; r < e.length; r++) this.writeByte(e[r]);
    }
    writeByte(e) {
      if (!Number.isInteger(e) || e < 0 || e > 255) throw new RangeError('byte 0-255');
      this._buf.push(e);
    }
    writeShort(e) {
      if (!Number.isInteger(e) || e < 0 || e > 65535) throw new RangeError('short 0-65535');
      (this.writeByte((e >>> 8) & 255), this.writeByte(e & 255));
    }
    writeInt(e) {
      if (!Number.isInteger(e) || e < 0 || e > 4294967295) throw new RangeError('int 0-4294967295');
      (this.writeByte((e >>> 24) & 255),
        this.writeByte((e >>> 16) & 255),
        this.writeByte((e >>> 8) & 255),
        this.writeByte(e & 255));
    }
    writeFloat(e) {
      let r = new DataView(new ArrayBuffer(4));
      r.setFloat32(0, e, !1);
      for (let t = 0; t < 4; t++) this.writeByte(r.getUint8(t));
    }
    writeDouble(e) {
      let r = new DataView(new ArrayBuffer(8));
      r.setFloat64(0, e, !1);
      for (let t = 0; t < 8; t++) this.writeByte(r.getUint8(t));
    }
    writeUTF(e) {
      let r = Ct.utf8Encode(e);
      this.writeShort(r.length);
      for (let t of r) this.writeByte(t);
    }
    toString() {
      return Ct.encodeBytes(Uint8Array.from(this._buf));
    }
  },
  Za = class {
    constructor(e) {
      g(this, '_bytes');
      g(this, '_pos', 0);
      this._bytes = Ct.decodeToBytes(e);
    }
    _need(e) {
      if (this._pos + e > this._bytes.length) throw new RangeError('EOF');
    }
    readBytes(e) {
      let r = new Uint8Array(e);
      for (let t = 0; t < e; t++) r[t] = this.readByte();
      return r;
    }
    readByte() {
      return (this._need(1), this._bytes[this._pos++]);
    }
    readShort() {
      return (this.readByte() << 8) | this.readByte();
    }
    readInt() {
      return (
        (this.readByte() << 24) | (this.readByte() << 16) | (this.readByte() << 8) | this.readByte()
      );
    }
    readFloat() {
      this._need(4);
      let r = new DataView(this._bytes.buffer, this._bytes.byteOffset + this._pos, 4).getFloat32(
        0,
        !1,
      );
      return ((this._pos += 4), r);
    }
    readDouble() {
      this._need(8);
      let r = new DataView(this._bytes.buffer, this._bytes.byteOffset + this._pos, 8).getFloat64(
        0,
        !1,
      );
      return ((this._pos += 8), r);
    }
    readUTF() {
      let e = this.readShort();
      this._need(e);
      let r = this._bytes.subarray(this._pos, this._pos + e);
      return ((this._pos += e), Ct.utf8Decode(r));
    }
    get remaining() {
      return this._bytes.length - this._pos;
    }
  },
  id = class {
    constructor() {
      g(this, 'encoding', 'b64');
    }
    encode(e) {
      let r = JSON.stringify(e);
      return Ct.encode(r);
    }
    encodeHeader(e) {
      let { id: r, frag: t, last: n } = e,
        o = new Ka();
      o.writeBytes(td(r));
      let i = 0;
      return (
        n !== void 0 && (i |= 1),
        o.writeByte(i),
        i & 1 && (o.writeShort(t), o.writeByte(n ? 1 : 0)),
        o.toString()
      );
    }
    decode(e) {
      try {
        let r = Ct.decode(e);
        return JSON.parse(r);
      } catch {
        return null;
      }
    }
    decodeHeader(e) {
      try {
        let r = new Za(e),
          t = r.readBytes(16),
          n = nd(t),
          o = r.readByte(),
          i = { id: n };
        return (o & 1 && ((i.frag = r.readShort()), (i.last = r.readByte() === 1)), i);
      } catch {
        return null;
      }
    }
  },
  Z,
  Pn =
    ((Z = class {
      static registerEncoder(r) {
        this.encoders.set(r.encoding, r);
      }
      static send(r, t, n, o) {
        let i = n?.encoding ?? Z.DefaultEncoding,
          a = Z.encoders.get(i);
        if (!a) throw new Error(`Unknown encoder: ${i}`);
        let u = a.encode(t),
          _ = (n?.id ?? rd()).replace(/-/g, '');
        if (u.length > Z.MaxMessageLength) {
          try {
            o?.({
              success: !1,
              code: 'message_too_large',
              message: `IPC message exceeds ${Z.MaxMessageLength} encoded characters`,
            });
          } catch {}
          return;
        }
        if (o) {
          let B = `ipcs:${_}`,
            N,
            A = ($) => {
              try {
                o($);
              } finally {
                (N !== void 0 && Ja.clearRun(N), Z.off(B, A));
              }
            };
          (Z.on(B, A),
            (N = Ja.runTimeout(() => {
              Z.off(B, A);
              try {
                o({
                  success: !1,
                  code: 'timeout',
                  message: `IPC request timed out while waiting for ${r}`,
                });
              } catch {}
            }, Z.RequestTimeout)));
        }
        let s = u.length,
          c = `${Ro}|${i}`,
          p = [],
          w = { version: Ro, encoding: i },
          C = ed(w),
          P = a.encodeHeader({ id: _ }),
          O = P.length,
          F = c.length + Cn.length + yn.length + O;
        if (s + F + C <= Xa) p = [[P, u]];
        else {
          let B = 0,
            A = s,
            $ = 0;
          for (; A > 0; ) {
            let N = a.encodeHeader({ id: _, frag: B, last: 0 }),
              K = N.length,
              Se = Math.min(Xa - K - C, A);
            (p.push([N, u.slice($, $ + Se)]), (A -= Se), ($ += Se), B++);
          }
        }
        if (p.length === 1) {
          let B = p[0][0],
            A = Ya(w, B, p[0][1]);
          Ja.sendScriptEvent(r, A);
        } else
          for (let B = 0; B < p.length; B++) {
            let A = { id: _, frag: B, last: B === p.length - 1 },
              $ = A.last ? a.encodeHeader(A) : p[B][0],
              N = Ya(w, $, p[B][1]);
            Ja.sendScriptEvent(r, N);
          }
      }
      static on(r, t) {
        let n = Z.listeners.get(r) ?? [];
        (n.push(t), Z.listeners.set(r, n));
      }
      static off(r, t) {
        let n = this.listeners.get(r);
        if (!n) return;
        let o = n.filter((i) => i !== t);
        o.length ? this.listeners.set(r, o) : this.listeners.delete(r);
      }
      static dispatch(r, t, n, o) {
        let i = Z.listeners.get(r);
        if (i)
          for (let a of i)
            try {
              n && !r.startsWith('ipcs:')
                ? a(t, (_) => {
                    Z.send(`ipcs:${n}`, _, { encoding: o, id: n });
                  })
                : a(t);
            } catch {}
      }
      static handleScriptEvent(r, t) {
        let [n, o] = t.split(Cn, 2);
        if (!o) return;
        let [i, a] = o.split(yn, 2);
        if (a === void 0) return;
        let [u, _] = n.split('|');
        if (parseInt(u, 10) !== Ro) return;
        let s = Z.encoders.get(_);
        if (!s) return;
        let c = s.decodeHeader(i);
        if (!c) return;
        let { id: p, frag: w, last: C } = c;
        if (w === void 0 || C === void 0) {
          let O = s.decode(a);
          O !== null && Z.dispatch(r, O, p, _);
          return;
        }
        if (!Number.isInteger(w) || w < 0 || w >= Z.MaxFragments || a.length > Z.MaxFragmentLength)
          return;
        let P = Z.buffers.get(p);
        if (!P) {
          (Z.cleanupExpiredBuffers(), Z.buffers.size >= Z.MaxBuffers) ||
            ((P = {
              parts: new Map(),
              totalLength: 0,
              expiresAt: Ja.currentTick + Z.BufferTimeout,
            }),
            Z.buffers.set(p, P));
        }
        if (!P) return;
        P.expiresAt = Ja.currentTick + Z.BufferTimeout;
        if (!P.parts.has(w)) {
          if (
            P.totalLength + a.length > Z.MaxMessageLength ||
            !Z.reserveBufferCapacity(a.length, p)
          ) {
            Z.dropBuffer(p);
            return;
          }
          (P.parts.set(w, a), (P.totalLength += a.length), (Z.totalBufferLength += a.length));
        }
        if (C) {
          if (P.lastIndex !== void 0 && P.lastIndex !== w) {
            Z.dropBuffer(p);
            return;
          }
          P.lastIndex = w;
        }
        if (P.lastIndex !== void 0 && P.parts.size === P.lastIndex + 1) {
          let O = '';
          for (let F = 0; F <= P.lastIndex; F++) {
            let B = P.parts.get(F);
            if (B === void 0) return;
            O += B;
          }
          Z.dropBuffer(p);
          let F = s.decode(O);
          F !== null && Z.dispatch(r, F, p, _);
        }
      }
      static dropBuffer(r) {
        let t = Z.buffers.get(r);
        t &&
          ((Z.totalBufferLength = Math.max(0, Z.totalBufferLength - t.totalLength)),
          Z.buffers.delete(r));
      }
      static reserveBufferCapacity(r, t) {
        Z.cleanupExpiredBuffers();
        if (Z.totalBufferLength + r <= Z.MaxTotalBufferLength) return !0;
        let n = [...Z.buffers.entries()]
          .filter(([o]) => o !== t)
          .sort(([, o], [, i]) => o.expiresAt - i.expiresAt);
        for (let [o] of n) {
          Z.dropBuffer(o);
          if (Z.totalBufferLength + r <= Z.MaxTotalBufferLength) return !0;
        }
        return Z.totalBufferLength + r <= Z.MaxTotalBufferLength;
      }
      static cleanupExpiredBuffers() {
        let r = Ja.currentTick;
        for (let [t, n] of Z.buffers) n.expiresAt <= r && Z.dropBuffer(t);
      }
    }),
    g(Z, 'listeners', new Map()),
    g(Z, 'buffers', new Map()),
    g(Z, 'totalBufferLength', 0),
    g(Z, 'encoders', new Map()),
    g(Z, 'DefaultEncoding', 'text'),
    g(Z, 'RequestTimeout', 200),
    g(Z, 'BufferTimeout', 200),
    g(Z, 'BufferCleanupInterval', 200),
    g(Z, 'MaxBuffers', 64),
    g(Z, 'MaxFragments', 256),
    g(Z, 'MaxFragmentLength', 2048),
    g(Z, 'MaxMessageLength', 256 * 1024),
    g(Z, 'MaxTotalBufferLength', 2 * 1024 * 1024),
    Z);
Pn.registerEncoder(new od());
Pn.registerEncoder(new id());
Ja.runInterval(() => Pn.cleanupExpiredBuffers(), Pn.BufferCleanupInterval);
var ad = 1;
function Ia(e, r, t, n) {
  ad === 1 && Pn.send(e, r, t, n);
}
Ms.afterEvents.scriptEventReceive.subscribe((e) => {
  Pn.handleScriptEvent(e.id, e.message);
});
var Ta = h.getLogger('LightRegistration'),
  _d = [
    {
      id: 'xp_furniture:placeable_glow_berries',
      ls: { airPower: 14, waterPower: 0 },
      type: 'item',
      force: !1,
    },
    {
      id: 'xp_furniture:placeable_enchanted_golden_apple',
      ls: { airPower: 1, waterPower: 0 },
      type: 'item',
      force: !1,
    },
    { id: 'xp_furniture:merchant', ls: { airPower: 15, waterPower: 0 }, type: 'entity', force: !1 },
  ];
function registerLights(e = 0) {
  Ia('xp_dl:register_light', { data: _d }, void 0, (r) => {
    if (r?.success) {
      Ta.info(r);
      return;
    }
    (Ta.error('Failed to register light', r?.message),
      r?.code === 'timeout' &&
        e < 4 &&
        ud.runTimeout(() => registerLights(e + 1), [20, 40, 80, 160][e]));
  });
}
ud.runTimeout(() => registerLights(), 5);
Mo();
_i();
h.setLevel(Ue.Debug);
h.setTagsOutputVisibility(!0);
