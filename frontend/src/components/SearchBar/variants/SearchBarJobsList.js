import React, {useEffect, useState} from 'react'
import { Button } from "components/MUI/Button"
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import styled from "styled-components"
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { Color } from "styles/color";
import Chip from '@mui/material/Chip';
import { SearchTypes, getSearchTypeName, getSearchTypeIcon} from "util/search/search"
import MUIButton from "@mui/material/Button";

// interface ISearchChip{
//     searchType: SearchTypes,
//     searchVal: string
// }
// interface ISearchBarJobsListInner{
//   chips: ISearchChip[],
//   onSearch : (val: string, type:SearchTypes): string => {} // callback
//   onDeleteChip : (index: number) => {} //callback
//   onClearChips: () => {}
// }

// interface ISearchBarJobsList{
//   onSearchUpdated: (chips: ISearchChip[]) => {}
// }

const SearchBarJobsListInner = (props) => {
  const {
    chips,
    onSearch,
    onDeleteChip,
    onClearChips
  } = props;

  const [searchType, setSearchType] = useState(SearchTypes.All);
  const [searchValue, setSearchValue] = useState("");

  const handleChange = (event) => {
    setSearchType(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const afterSearchVal = onSearch(searchType, searchValue);
    setSearchValue(afterSearchVal);
  }

  const Chips = () => {
    if(chips.length <= 0){
        return null;
    }
    return (
        <ChipsWrapperWrapper>
        <ChipsWrapper>
            {
                chips.map(({searchType, searchVal}, i)=>(
                    <Chip
                        icon={getSearchTypeIcon(searchType)}
                        label={`${getSearchTypeName(searchType)}: ${searchVal}`}
                        onDelete={()=>{onDeleteChip(i)}}
                        key={i}
                    />
                ))
            }
        </ChipsWrapper>
        <MUIButton onClick={onClearChips}>Clear</MUIButton>
        </ChipsWrapperWrapper>
    )
  }

  const SearchTypeSelect = () => (
    <StyledSelect
        value={searchType}
        onChange={handleChange}
    >
        {
            Object.values(SearchTypes).map(item=>(
                <MenuItem value={item} key={item}>{getSearchTypeName(item)}</MenuItem>
            ))
        }
    </StyledSelect>
  )

  return (
    <MainWrapper>
        <form onSubmit={handleSubmit}>
            <SearchInputWrapper >
                <SearchTypeSelect /> 
                <StyledTextField
                placeholder="Search"
                value={searchValue}
                onChange={(event)=>{
                    setSearchValue(event.target.value);
                }}
                />
                <StyledButton variant="outline-primary"><SearchIcon/></StyledButton>
            </SearchInputWrapper>
        </form>
        <Chips />
    </MainWrapper>
  )
}

//Example use case
//TODO: Add implementation
export const SearchBarJobsList = (props) => {
    const [chips, setChips] = useState([]);

    useEffect(() => {
      props.onSearchUpdated(chips);
    }, [props, chips])

    const onClearChips = () => {
        setChips([])
    }
    const onSearch = (type, val) => {
        const newChip = {
          searchType: type,
          searchVal: val
        };

        var found = false;
        const newChips = chips.map((chip) => {
          if (chip.searchType === type) {
            found = true;
            return newChip;
          }
          else {
            return chip;
          }
        });
        if (!found) {
          newChips.push(newChip);
        }

        setChips(newChips);
        return "";
    } 
    const onDeleteChip = (index) => {
        const tempChips = [...chips];
        tempChips.splice(index, 1);
        setChips(tempChips);
    } 

    return (
        <SearchBarJobsListInner
            chips={chips}
            onSearch={onSearch}
            onDeleteChip={onDeleteChip}
            onClearChips={onClearChips}
        />
    )
}

const StyledTextField = styled(TextField)`
    flex: 1;
    background-color: white;
    margin-right: -4px!important;
`
const SearchInputWrapper = styled.div`
  display: flex;
  width: 100%;
`
const MainWrapper = styled.div`
  width: 100%;
  min-width: 300px;
  position: relative;
`
const StyledButton = styled(Button)`
  && {
    position: relative;
    border-radius: 0 4px 0 0;
  }
`

const StyledSelect = styled(Select)`
  && {
    position: relative;
    left: 4px;
    z-index: 1;
    border-radius: 4px 0px 0px 4px;
    margin-left: -4px;
    background-color: ${Color.primary};
    color: white;
    font-weight: bold;
  }
  && svg{
    color: white;
  }
`

const ChipsWrapper = styled.div`
    width: 100%;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`
const ChipsWrapperWrapper = styled.div`
  padding: 16px;
  width: 100%;
`

