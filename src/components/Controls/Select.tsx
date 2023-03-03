import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, {SelectChangeEvent} from '@mui/material/Select';

type Props = {
  label: string;
  disabled?: boolean;
  values: {id: number | string; label: string | number}[];
  onChangeHandler: (value: string, name?: string) => void;
  defaultValue?: string;
  name: string;
  inputRef?: React.MutableRefObject<HTMLInputElement | null>;
  value: string;
};

export function MuiSelect({values, onChangeHandler, label, name, inputRef, value, disabled = false}: Props) {
  const handleChange = (event: SelectChangeEvent) => {
    const {value, name} = event.target;
    onChangeHandler(value, name);
  };

  return (
    <FormControl sx={{m: 0, minWidth: 120}} size='small' data-testid={`formcontrol-${label}-select`}>
      <InputLabel id='demo-select-small' data-testid={`select-${label}-label`}>
        {label}
      </InputLabel>
      <Select
        inputProps={{
          'data-testid': `select-${name}`,
        }}
        inputRef={inputRef}
        disabled={disabled}
        labelId='demo-select-small'
        data-testid={`select-wrapper-${name}`}
        id='demo-select-small'
        label={label}
        onChange={handleChange}
        name={name}
        value={value}
      >
        {values.map((item) => {
          return (
            <MenuItem key={`${item.id}-${item.label}`} value={item.id}>
              {item.label}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}
