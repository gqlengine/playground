import * as React from 'react'
import TypeLink from './TypeLink'
import { styled } from '../../../styled'
import {defaultTypes} from "../util/createSDL";

export interface Props {
  schema: any
  sessionId: string
}

const builtinTypes = [
    "DateTime",
    "Duration",
    "Upload",
    "Query",
    "Mutation",
    "Subscription",
];

export default class GraphTypesRoot extends React.PureComponent<Props, {}> {
  render() {
    const { schema, sessionId } = this.props;
    const typeMap = schema.getTypeMap() || {};
    const typeNames = Object.keys(typeMap).filter(name =>
        !defaultTypes.includes(name) && !builtinTypes.includes(name)
    ).sort();
    return (
      <DocsRoot className="doc-root">
        {typeNames.map((typeName, index) => {
          const type = typeMap[typeName];
          return (
              <TypeLink
                  key={typeName}
                  type={type}
                  x={0}
                  y={index}
                  collapsable={true}
                  lastActive={false}
                  showTitle={true}
                  sessionId={sessionId}
              />
          )
        })}
      </DocsRoot>
    )
  }
}

const DocsRoot = styled.div`
  padding-left: 6px;

  .doc-category-item .field-name {
    color: #f25c54;
  }
`
