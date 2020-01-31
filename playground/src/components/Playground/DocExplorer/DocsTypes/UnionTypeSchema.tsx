import TypeLink from '../TypeLink'
import * as React from 'react'
import { DocType } from './DocType'

export interface EnumTypeSchemaProps {
  schema: any
  type: any
  level: number
  indexOffset: number
  sessionId: string
}

const UnionTypeSchema = ({
  schema,
  type,
  level,
  indexOffset = 0,
  sessionId,
}: EnumTypeSchemaProps) => {
  const types = schema.getPossibleTypes(type)
  return (
    <DocType className="doc-type-schema">
      <span className="field-name">union</span>{' '}
      <span className="type-name">{type.name}</span>
      {' = '}
      {types.map((value, index) => (
        <TypeLink
          key={value.name}
          type={value}
          x={level}
          y={index + 1 + indexOffset}
          collapsable={true}
          sessionId={sessionId}
          lastActive={false}
        />
      ))}
    </DocType>
  )
}

export default UnionTypeSchema
