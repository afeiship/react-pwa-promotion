import React, { HTMLAttributes } from 'react';
import cx from 'classnames';
import SwRuntime from '@jswork/sw-runtime';

const CLASS_NAME = 'react-pwa-promotion';
const locals = {
  'en-US': {
    'update-available': '🚀 New content available, click on reload button to update.',
    'reload': 'Reload',
    'close': 'Close',
  },
  'zh-CN': {
    'update-available': '有新内容可用，点击重新加载按钮更新。',
    'reload': '⚡️ 重新加载',
    'close': '🧨 关闭',
  },
};

type ReactPwaPromotionProps = {
  className?: string;
  lang?: string;
  disabled?: boolean;
  interval?: number;
  mute?: boolean;
} & HTMLAttributes<any>;

export default class ReactPwaPromotion extends React.Component<ReactPwaPromotionProps> {
  static defaultProps = {
    lang: 'en-US',
    disabled: false,
    interval: 20 * 1000,
    mute: false,
  };

  state = {
    needRefresh: false,
  };

  private swInstance: any;

  t = (inKey) => {
    const { lang } = this.props;
    return locals[lang!][inKey] || inKey;
  };

  componentDidMount() {
    const { disabled, interval, mute } = this.props;
    this.swInstance = SwRuntime.install({
      autoUpdate: true,
      disabled,
      autoUpdateInterval: interval,
      onAutoUpdate: function () {
        if (mute) return;
        console.log('SW Event: onAutoUpdate');
      },
      onUpdateReady: () => {
        this.setNeedRefresh(true);
      },
    });
  }

  updateServiceWorker = () => {
    this.swInstance.applyUpdate().then(() => {
      this.setNeedRefresh(false);
    });
  };

  setNeedRefresh = (needRefresh: boolean) => {
    this.setState({ needRefresh });
  };

  render() {
    const { className, lang, interval, mute, ...props } = this.props;
    const { needRefresh } = this.state;

    if (!needRefresh) return null;

    return (
      <div className={cx(CLASS_NAME, className)} {...props}>
        <header className={`${CLASS_NAME}__header`}>{this.t('update-available')}</header>
        <footer className={`${CLASS_NAME}__footer`}>
          <button onClick={() => this.updateServiceWorker()}>{this.t('reload')}</button>
          <button onClick={() => this.setNeedRefresh(false)}>{this.t('close')}</button>
        </footer>
      </div>
    );
  }
}
