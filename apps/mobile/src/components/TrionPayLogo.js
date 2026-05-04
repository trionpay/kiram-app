import React from 'react';
import { Image } from 'react-native';

const logoHorizontal = require('../../assets/kiram-yatay-mavi-clean.png');
const logoVertical = require('../../assets/kiram-dikey-mavi-clean.png');
const logoVerticalWhite = require('../../assets/kiram-dikey-beyaz.png');

export function TrionPayLogo({ width = 280, variant = 'horizontal' }) {
  const ratio = (variant === 'vertical' || variant === 'vertical-white') ? (454 / 529) : (200 / 841);
  const source =
    variant === 'vertical'
      ? logoVertical
      : variant === 'vertical-white'
        ? logoVerticalWhite
        : logoHorizontal;
  return (
    <Image
      source={source}
      resizeMode="contain"
      style={{
        width,
        height: width * ratio,
      }}
    />
  );
}
