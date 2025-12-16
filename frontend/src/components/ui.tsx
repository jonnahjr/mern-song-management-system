import styled from '@emotion/styled';
import {
  space,
  layout,
  flexbox,
  border,
  color,
  typography,
  shadow,
  SpaceProps,
  LayoutProps,
  FlexboxProps,
  BorderProps,
  ColorProps,
  TypographyProps,
  ShadowProps,
} from 'styled-system';

type StyledSystemProps = SpaceProps &
  LayoutProps &
  FlexboxProps &
  BorderProps &
  ColorProps &
  TypographyProps &
  ShadowProps;

export const Box = styled.div<StyledSystemProps>`
  ${space}
  ${layout}
  ${flexbox}
  ${border}
  ${color}
  ${typography}
  ${shadow}
`;

export const Flex = styled(Box)`
  display: flex;
`;

export const Card = styled(Box)`
  background: #fff;
  border: 1px solid #e3e3e3;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
`;

export const Button = styled.button<StyledSystemProps>`
  border: none;
  border-radius: 6px;
  padding: 10px 16px;
  font-weight: 600;
  cursor: pointer;
  ${space}
  ${color}
  ${typography}
  ${layout}
  ${shadow}
  transition: transform 0.1s ease, box-shadow 0.1s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

