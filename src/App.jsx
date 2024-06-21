import './App.css';
import {
  AppBar,
  Toolbar,
  Stack,
  Typography,
  Paper,
  Grid,
  Button
} from '@mui/material';
import { useState, useEffect } from "react";
import DynamicTable from './components/DynamicTable';
import { FaDatabase } from "react-icons/fa6";
import BarChart from './components/BarChart';
import _ from 'lodash';
import { useFetch } from "./hooks/useFetch";
import DatasourceSelect from './components/DatasourceSelect';
import SumBySelect from './components/SumBySelect';
import ViewBySelect from './components/ViewBySelect';
import DetailBySelect from './components/DetailBySelect';
import TypeViewRadioGroup from './components/TypeViewRadioGroup';
import { calculateSumByGroup, sumAllValues } from './utils/handleViewByField';
import { calculateSumByDetail, sumAllValuesDetail } from './utils/handleDetailByField';

function App() {
  const datasources = [
    { name: "datasource1.json", title: "Produtos" },
    { name: "datasource2.json", title: "Clientes" },
    { name: "datasource3.json", title: "Funcionários" },
    { name: "datasource4.json", title: "Projetos" },
    { name: "datasource5.json", title: "Movimentações" }
  ];

  const [ selected, setSelected ] = useState('datasource1.json');
  const [ data, setData ] = useState([{id: 0}]);
  const [ filteredData, setFilteredData ] = useState([{}]);

  const [ sumField, setSumField ] = useState();
  const [ selectedSumField, setSelectedSumField ] = useState('');

  const [ viewByField, setViewByField ] = useState();
  const [ selectedViewByField, setSelectedViewByField ] = useState('');
  const [ disabledViewByField, setDisabledViewByField ] = useState(true);

  const [ detailField, setDetailField ] = useState();
  const [ selectedDetailField, setSelectedDetailField ] = useState('');
  const [ disabledDetailField, setDisabledDetailField ] = useState(true);

  const [ type, setType ] = useState("table");
  const [ dimension, setDimension ] = useState(false);

  const [ sumValue, setSumValue ] = useState([]);

  const handleDatasourceFieldChange = (event) => {
    setSelected(event.target.value);
    setSelectedSumField('');
    setSelectedViewByField('');
    setSelectedDetailField('');
    setDisabledViewByField(true);
    setDisabledDetailField(true);
  }

  const handleSumFieldChange = (event) => {
    setSelectedSumField(event.target.value);
    setDisabledViewByField(false);
  }

  const handleViewByFieldChange = (event) => {
    setSelectedViewByField(event.target.value);

    let valuesCalculatedByGroup = calculateSumByGroup(data, event.target.value, selectedSumField);

    sumAllValues(valuesCalculatedByGroup);
    setFilteredData(valuesCalculatedByGroup);
    setDisabledDetailField(false);
  }

  const handleDetailFieldChange = (event) => {
    setSelectedDetailField(event.target.value);

    let valuesCalculatedByDetail = calculateSumByDetail(data, event.target.value, selectedSumField, selectedViewByField);
    let totalValue = sumAllValuesDetail(valuesCalculatedByDetail)

    setFilteredData(totalValue);
  }


  const handleTypeChange = (event) => {
    setType(event.target.value);
  }

  const clearAllFields = () => {
    setSelectedSumField('');
    setSelectedViewByField('');
    setSelectedDetailField('');
    setDisabledViewByField(true);
    setDisabledDetailField(true);
    setType('table');
    setFilteredData(data);
  }

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`datasource/${selected}`);
      const result = await response.json();
      const fields = Object.keys(result[0]);

      setData(result);
      setFilteredData(result);
      setSumField(fields);
      setViewByField(fields);
      setDetailField(fields);
    };
    fetchData();
  }, [selected]);

  return (
    <Stack direction="column" spacing={2} justifyContent={"center"}>
      <AppBar position="static">
        <Toolbar>
          <FaDatabase size={25} />
          <Typography variant="h6" mt={1}>LacLaw Project</Typography>
        </Toolbar>
      </AppBar>
      <Grid 
        container 
        justifyContent={"center"}
        alignItems={"center"}
        >
        <Grid item xs={11} md={8}>
          <Stack spacing={2}>
            <Paper sx={{padding: 1}} elevation={1}>
              <Grid container spacing={1}>
                <Grid item xs={12} md={3}>
                  <DatasourceSelect 
                    handleDatasourceFieldChange={handleDatasourceFieldChange}
                    selected={selected}
                    datasources={datasources}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <SumBySelect
                    handleSumFieldChange={handleSumFieldChange}
                    selectedSumField={selectedSumField}
                    sumField={sumField}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <ViewBySelect
                    disabledViewByField={disabledViewByField}
                    handleViewByFieldChange={handleViewByFieldChange}
                    selectedViewByField={selectedViewByField}
                    viewByField={viewByField}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <DetailBySelect
                    disabledDetailField={disabledDetailField}
                    handleDetailFieldChange={handleDetailFieldChange}
                    selectedDetailField={selectedDetailField}
                    detailField={detailField}
                  />
                </Grid>
              </Grid>

              <Grid container>
                <Grid item xs={12} md={6}>
                  <TypeViewRadioGroup
                    type={type}
                    handleTypeChange={handleTypeChange}
                    disabledDetailField={disabledDetailField}
                  />
                </Grid>

                <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: {xs: 'start', md: 'end'} }}>
                  <Button size="small" variant="contained" onClick={clearAllFields}>
                    Limpar
                  </Button>
                </Grid>
              </Grid>

            </Paper>

            <Paper sx={{padding: 1}} elevation={2} >
              {type === 'table' && <DynamicTable datasource={filteredData} sumValue={sumValue} />}
              {type === 'graph' && <BarChart datasource={filteredData} dimension={dimension} />}
            </Paper>

          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
}

export default App;
