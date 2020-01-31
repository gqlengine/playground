import * as React from 'react'
import ColumnDoc from './ColumnDoc'
import SearchResults from './SearchResults'
import GraphDocsRoot from './GraphDocsRoot'
import SearchBox from './SearchBox'
import { styled } from '../../../styled'
import GraphTypesRoot from "./GraphTypesRoot";

export interface Props {
  searchValue: string
  schema: any
  width: number
  handleSearch: (value: string) => void
  sessionId: string
  showSchema: boolean
  typeOnly?: boolean
}

export default class RootColumn extends React.PureComponent<Props, {}> {
  render() {
    const { searchValue, schema, width, sessionId, handleSearch, showSchema, typeOnly } = this.props
    return (
      <ColumnDoc width={width} overflow={false}>
        <SearchBox onSearch={handleSearch} />
        <Column>
          {searchValue && (
            <SearchResults
              searchValue={searchValue}
              schema={schema}
              level={0}
              sessionId={sessionId}
              typeOnly={typeOnly}
            />
          )}
          {!searchValue && showSchema && (
            <GraphDocsRoot schema={schema} sessionId={sessionId} />
          )}
          {!searchValue && !showSchema && (
            <GraphTypesRoot schema={schema} sessionId={sessionId} />
          )}
        </Column>
      </ColumnDoc>
    )
  }
}

const Column = styled.div`
  overflow: auto;
`
