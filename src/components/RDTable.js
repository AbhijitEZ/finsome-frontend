/* eslint-disable react/prop-types */
import React from 'react'
import styled from 'styled-components'
import DataTable, { defaultThemes } from 'react-data-table-component'

const StyledDataTableWrapper = styled.div`
  .rdt_TableHead {
    color: rgba(44, 56, 74, 0.95);
    font-size: 16px;
    font-weight: 600;
  }
  .rdt_TableBody div {
    color: rgba(44, 56, 74, 0.95);
    font-size: 15px;
    font-weight: 400;
  }

  .rdt_TableCell div[data-tag='allowRowEvents'] {
    width: 100%;
    white-space: pre-wrap;
    padding-bottom: 5px;
    padding-top: 5px;
    text-overflow: initial;
  }
`

export const RDTable = (props) => {
  return (
    <StyledDataTableWrapper>
      {props.headerTitle ? (
        <div xs={12}>
          <h5>
            {props.headerTitle}: ({props.data.length})
          </h5>
        </div>
      ) : null}
      <DataTable {...props} customStyles={customStyles} />
    </StyledDataTableWrapper>
  )
}

const customStyles = {
  header: {
    style: {
      minHeight: '56px',
    },
  },
  headRow: {
    style: {
      borderTopStyle: 'solid',
      borderTopWidth: '1px',
      borderTopColor: defaultThemes.default.divider.default,
    },
  },
  headCells: {
    style: {
      '&:not(:last-of-type)': {
        borderRightStyle: 'solid',
        borderRightWidth: '1px',
        borderRightColor: defaultThemes.default.divider.default,
      },
    },
  },
  cells: {
    style: {
      '&:not(:last-of-type)': {
        borderRightStyle: 'solid',
        borderRightWidth: '1px',
        borderRightColor: defaultThemes.default.divider.default,
      },
    },
  },
}
