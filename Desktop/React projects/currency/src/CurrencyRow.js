import React from 'react';
import { Box, Input, Select } from '@chakra-ui/react'; // Import Chakra UI components

export default function CurrencyRow(props) {
  const {
    currencyOptions,
    selectedCurrency,
    onChangeCurrency,
    onChangeAmount,
    amount
  } = props;

  return (
    <Box mb="4">
      <Input
        type="number"
        value={amount}
        onChange={onChangeAmount}
        mb="2"
        placeholder="Amount"
        size="lg"
      />
      <Select value={selectedCurrency} onChange={onChangeCurrency} size="lg">
        {currencyOptions.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </Select>
    </Box>
  );
}
