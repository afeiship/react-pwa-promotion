/** 卡片布局：标题（+版本号）/ 描述 / 单个主按钮 */

import type { UpdateCopy } from '../constants';
import { CLASS_NAME } from '../constants';
import { CloseIcon } from './icons';

interface Props {
  copy: UpdateCopy;
  version?: string;
  closeButton?: boolean;
  closeLabel: string;
  updating: boolean;
  onDismiss: () => void;
  onUpdate: () => void;
}

export default function CardLayout({
  copy,
  version,
  closeButton,
  closeLabel,
  updating,
  onDismiss,
  onUpdate
}: Props) {
  return (
    <>
      {closeButton && (
        <button
          type="button"
          className={`${CLASS_NAME}__close`}
          aria-label={closeLabel}
          onClick={onDismiss}>
          <CloseIcon />
        </button>
      )}
      <div className={`${CLASS_NAME}__title`}>
        {copy.title}
        {version && <span className={`${CLASS_NAME}__version`}>{version}</span>}
      </div>
      <div className={`${CLASS_NAME}__desc`}>{copy.description}</div>
      <div className={`${CLASS_NAME}__actions`}>
        <button
          type="button"
          className={`${CLASS_NAME}__btn ${CLASS_NAME}__btn--primary`}
          disabled={updating}
          aria-busy={updating}
          onClick={onUpdate}>
          {updating && <span className={`${CLASS_NAME}__spin`} aria-hidden="true" />}
          {copy.update}
        </button>
      </div>
    </>
  );
}
