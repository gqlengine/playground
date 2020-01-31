import * as React from 'react'
import TypeLink from './TypeLink'
import { styled } from '../../../styled'
import { GraphQLNamedType} from "graphql";
import {CategoryTitle} from "./DocsStyles";
import {sortTypesFromSchema} from "../util/typeSorts";

export interface Props {
  schema: any
  sessionId: string
}


export default class GraphTypesRoot extends React.PureComponent<Props, {}> {
  render() {
    const { schema, sessionId } = this.props;
    const sorts = sortTypesFromSchema(schema);
    return (
      <DocsRoot className="doc-root">
          <ShowRootType
              name="Objects"
              fields={sorts.objects}
              offset={0}
              sessionId={sessionId}
          />
          <ShowRootType
              name="Interfaces"
              fields={sorts.interfaces}
              offset={sorts.objects.length}
              sessionId={sessionId}
          />
          <ShowRootType
              name="Enums"
              fields={sorts.enums}
              offset={sorts.objects.length + sorts.interfaces.length}
              sessionId={sessionId}
          />
          <ShowRootType
              name="Scalars"
              fields={sorts.scalars}
              offset={sorts.objects.length + sorts.interfaces.length + sorts.enums.length}
              sessionId={sessionId}
          />
          <ShowRootType
              name="Unions"
              fields={sorts.unions}
              offset={sorts.objects.length + sorts.interfaces.length + sorts.enums.length + sorts.scalars.length}
              sessionId={sessionId}
          />
      </DocsRoot>
    )
  }
}

interface ShowRootTypeProps {
    name: string
    fields: GraphQLNamedType[]
    offset: number
    sessionId: string
}

function ShowRootType({ name, fields, offset }: ShowRootTypeProps) {
    if (fields.length === 0) {
        return null;
    }
    return (
        <div>
            <CategoryTitle>{name}</CategoryTitle>
            {fields
                .map((type, index) => (
                    <TypeLink
                        key={type.name}
                        type={type}
                        x={0}
                        y={offset + index}
                        collapsable={true}
                        lastActive={false}
                        showTitle={true}
                    />
                ))}
        </div>
    )
}

const DocsRoot = styled.div`
  padding-left: 6px;

  .doc-category-item .field-name {
    color: #f25c54;
  }
`;
