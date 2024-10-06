import { Paragraph } from '@components/atoms'
import styled from '@emotion/styled'
import { colorToken } from '@styles/color-token'
import { ParagraphProps } from 'antd/es/typography/Paragraph'
import { ReactNode } from 'react'

interface RangeOptionProps {
  isSelected: boolean
  children: ReactNode
  fontSize: string
}

export const Flex = styled.div`
  display: flex;
`

export const IconContainer = styled.div<{
  isActive?: boolean
}>`
  cursor: pointer;
  height: 2rem;
  width: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.25rem;
  background: ${(props) =>
    props.isActive ? 'rgba(0, 125, 254, 0.15)' : 'white'};
`

export const ConfigContainer = styled.div<{
  withBorderTop?: boolean
}>`
  display: flex;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid ${colorToken.lightBlue};
  margin-bottom: 1rem;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid
    ${(props) => (props.withBorderTop ? colorToken.lightBlue : 'transparent')};
  padding-top: ${(props) => (props.withBorderTop ? '0.75rem' : 0)};
`

export const RangeOption = styled(
  ({ isSelected, children, ...props }: RangeOptionProps & ParagraphProps) => (
    <Paragraph {...props}>{children}</Paragraph>
  )
)<RangeOptionProps>`
  cursor: pointer;
  border-radius: 3px;
  padding: 0 10px;
  margin: 0 !important;
  color: ${(props) => (props.isSelected ? 'white' : 'black')};
  font-weight: 400;
  background-color: ${(props) =>
    props.isSelected ? colorToken.blueSamudra : 'transparent'};
`
