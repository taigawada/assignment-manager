import { addDays, isSameDay, set } from "date-fns";

/**
 * 日本標準時に準拠したDateクラス
 * (一部、date-fnsをラップしています。)
 */
export default class SimpleDate {
  /**
   * 現在時刻(JST)を実行環境に左右されることなく返します。
   */
  static now() {
    return new Date(
      Date.now() + (new Date().getTimezoneOffset() + 9 * 60) * 60 * 1000,
    );
  }
  /**
   * 現在より過去であるかを真偽値で返します。
   * @param {Date} date
   */
  static isPast(date: Date) {
    if (this.now() > date) return true;
    else return false;
  }
  /**
   * 現在より未来であるかを真偽値で返します。
   * @param {Date} date
   */
  static isFuture(date: Date) {
    if (this.now() < date) return true;
    else return false;
  }
  static isToday(date: Date) {
    if (isSameDay(this.now(), date)) return true;
    else return false;
  }
  /**
   * 明日の日付かどうかを真偽値で返します。
   * @param {Date} date
   */
  static isTomorrow(date: Date) {
    if (isSameDay(addDays(this.now(), 1), date)) return true;
    else return false;
  }
  /**
   * 未来の日付で00分に切り上げたDateオブジェクトを返します。
   */
  static ceilDate() {
    const now = SimpleDate.now();
    if (now.getHours() === 23) {
      return set(now, {
        date: now.getDate() + 1,
        hours: 0,
        minutes: 0,
      });
    }
    return set(now, {
      hours: now.getHours() + 1,
      minutes: 0,
    });
  }
  static today() {
    const init = this.now();
    const gte = new Date(
      init.getUTCFullYear(),
      init.getUTCMonth(),
      init.getUTCDate(),
    );
    const lte = new Date(
      init.getUTCFullYear(),
      init.getUTCMonth(),
      init.getUTCDate() + 1,
    );

    return { lte, gte };
  }
  static future() {
    const init = this.now();
    const gte = new Date(
      init.getUTCFullYear(),
      init.getUTCMonth(),
      init.getUTCDate(),
    );

    return { gte };
  }
}
