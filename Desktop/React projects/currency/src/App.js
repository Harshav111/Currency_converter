import React, { useEffect, useState } from 'react';
import { Box, Flex, Heading, Text } from '@chakra-ui/react'; // Import Chakra UI components
import CurrencyRow from './CurrencyRow';

const BASE_URL = 'https://openexchangerates.org/api/latest.json?app_id=ca9e9bb349af4a7fb74022163b5f4041';

function App() {
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [fromCurrency, setFromCurrency] = useState();
  const [toCurrency, setToCurrency] = useState();
  const [exchangeRate, setExchangeRate] = useState();
  const [amount, setAmount] = useState(1);
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  let toAmount, fromAmount;
  if (amountInFromCurrency) {
    fromAmount = amount;
    toAmount = amount * exchangeRate;
  } else {
    toAmount = amount;
    fromAmount = amount / exchangeRate;
  }

  useEffect(() => {
    fetch(BASE_URL)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data) => {
        const uniqueCurrencies = Array.from(new Set([data.base, ...Object.keys(data.rates)]));
        const firstCurrency = uniqueCurrencies[1]; 
        setCurrencyOptions(uniqueCurrencies);
        setFromCurrency(data.base);
        setToCurrency(firstCurrency);
        setExchangeRate(data.rates[firstCurrency]);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (fromCurrency && toCurrency) {
      fetch(BASE_URL)
        .then((res) => res.json())
        .then((data) => {
          if (data.rates[toCurrency]) {
            setExchangeRate(data.rates[toCurrency]);
          } else {
            setError(`Exchange rate for ${toCurrency} not found`);
          }
        })
        .catch((error) => {
          setError(error.message);
        });
    }
  }, [fromCurrency, toCurrency]);

  function handleFromAmountChange(e) {
    setAmount(e.target.value);
    setAmountInFromCurrency(true);
  }

  function handleToAmountChange(e) {
    setAmount(e.target.value);
    setAmountInFromCurrency(false);
  }

  if (loading) {
    return <Box p={4}>Loading...</Box>;
  }

  if (error) {
    return <Box p={4}>Error: {error}</Box>;
  }

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bgImage="url('https://images.pexels.com/photos/164636/pexels-photo-164636.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')" 
      bgSize="cover"
      bgPosition="center"
    >
      <Box
        maxW="400px"
        w="100%"
        p="6"
        bg="white"
        borderRadius="md"
        boxShadow="xl"
        textAlign="center"
      >
        <Heading as="h1" size="lg" mb="4">
          Convert Currency
        </Heading>
        <CurrencyRow
          currencyOptions={currencyOptions}
          selectedCurrency={fromCurrency}
          onChangeCurrency={(e) => setFromCurrency(e.target.value)}
          onChangeAmount={handleFromAmountChange}
          amount={fromAmount}
        />
        <Text fontSize="2xl" my="2">
          =
        </Text>
        <CurrencyRow
          currencyOptions={currencyOptions}
          selectedCurrency={toCurrency}
          onChangeCurrency={(e) => setToCurrency(e.target.value)}
          onChangeAmount={handleToAmountChange}
          amount={toAmount}
        />
      </Box>
    </Flex>
  );
}

export default App;
