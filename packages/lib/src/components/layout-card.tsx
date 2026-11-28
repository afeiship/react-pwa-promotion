/** 卡片布局：标题（+版本号）/ 描述 / 底部按钮组 */

import type { PwaUpdateTexts } from '../types';
import { CLASS_NAME } from '../constants';
import { CloseIcon } from './icons';

interface Props {
  texts: PwaUpdateTexts;
  version?: string;
  closeButton?: boolean;
  closeLabel: string;
  updating: boolean;
  onDismiss: () => void;
  onUpdate: () => void;
}

export default function CardLayout({
  texts,
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
        {texts.title}
        {version && <span className={`${CLASS_NAME}__version`}>{version}</span>}
      </div>
      <div className={`${CLASS_NAME}__desc`}>{texts.description}</div>
      <div className={`${CLASS_NAME}__actions`}>
        {texts.dismiss && (
          <button
            type="button"
            className={`${CLASS_NAME}__btn ${CLASS_NAME}__btn--ghost`}
            onClick={onDismiss}>
            {texts.dismiss}
          </button>
        )}
        <button
          type="button"
          className={`${CLASS_NAME}__btn ${CLASS_NAME}__btn--primary`}
          disabled={updating}
          aria-busy={updating}
          onClick={onUpdate}>
          {updating && <span className={`${CLASS_NAME}__spin`} aria-hidden="true" />}
          {texts.update}
        </button>
      </div>
    </>
  );
}
