/** 横条布局（toast）：圆形勾图标 + 单行文案 + 关闭 + 胶囊按钮。
 *  loading 时图标原地旋转（RefreshIcon 的 spinning），避免布局跳动。 */

import type { UpdateCopy } from '../constants';
import { CLASS_NAME } from '../constants';
import { CheckIcon, CloseIcon, RefreshIcon } from './icons';

interface Props {
  copy: UpdateCopy;
  updating: boolean;
  onDismiss: () => void;
  onUpdate: () => void;
}

export default function BarLayout({ copy, updating, onDismiss, onUpdate }: Props) {
  return (
    <>
      <div className={`${CLASS_NAME}__icon`} aria-hidden="true">
        <CheckIcon />
      </div>
      <div className={`${CLASS_NAME}__label`}>{copy.title}</div>
      <button
        type="button"
        className={`${CLASS_NAME}__close`}
        aria-label="Close"
        onClick={onDismiss}>
        <CloseIcon size={14} />
      </button>
      <button
        type="button"
        className={`${CLASS_NAME}__btn ${CLASS_NAME}__btn--primary`}
        disabled={updating}
        aria-busy={updating}
        onClick={onUpdate}>
        <RefreshIcon spinning={updating} />
        {copy.update}
      </button>
    </>
  );
}
