import {
    Box
} from '@mui/material';
import { 
    DataGrid,
} from '@mui/x-data-grid';
import { ptBR } from '@mui/x-data-grid/locales';
import { randomId } from "../../utils/randomId";

export default function DynamicTable({datasource}){
    const keys = Object.keys(datasource[0]);

    const rows = datasource;
    const columns = keys.map(function(item, index){
        return {
            field: item,
            headerName: item.toUpperCase()
        };
    });

    return (
        <Box>
            <DataGrid 
                rows={rows}
                columns={columns}
                localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
                pagination
                density="compact"
                getRowId={() => randomId()}
            />
      </Box>
    )
}