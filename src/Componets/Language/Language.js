// src/components/LanguageSelector.js
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FormControl, InputLabel, MenuItem, Select, CircularProgress, Box } from '@mui/material';
import EmailOTP from '../verification/EmailOTP';
import MobileOTP from '../verification/MobileOTP';

const LanguageSelector = ({ onLanguageChange }) => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);
  const [openEmailOTP, setOpenEmailOTP] = useState(false);
  const [openMobileOTP, setOpenMobileOTP] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLanguage(i18n.language);
  }, [i18n.language]);

  const handleChange = (event) => {
    const selectedLanguage = event.target.value;
    setLanguage(selectedLanguage);

    if (selectedLanguage === 'fr') {
      setOpenEmailOTP(true);
    } else if (['es', 'hi', 'pt', 'zh'].includes(selectedLanguage)) {
      setOpenMobileOTP(true);
    } else {
      changeLanguage(selectedLanguage);
    }
  };

  const changeLanguage = (selectedLanguage) => {
    setLoading(true);
    i18n.changeLanguage(selectedLanguage)
      .then(() => {
        onLanguageChange(selectedLanguage); // Update background color
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        // Optionally handle the error
      });
  };

  const handleVerify = (verifiedLanguage) => {
    changeLanguage(verifiedLanguage);
    setOpenEmailOTP(false);
    setOpenMobileOTP(false);
  };

  return (
    <div className='my-3'>
      <FormControl variant="outlined" fullWidth>
        <InputLabel id="language-selector-label">Language</InputLabel>
        <Select
          labelId="language-selector-label"
          id="language-selector"
          value={language}
          onChange={handleChange}
          label="Language"
        >
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="es">Spanish</MenuItem>
          <MenuItem value="hi">Hindi</MenuItem>
          <MenuItem value="pt">Portuguese</MenuItem>
          <MenuItem value="zh">Chinese</MenuItem>
          <MenuItem value="fr">French</MenuItem>
        </Select>
      </FormControl>

      {loading && (
        <Box display="flex" justifyContent="center" mt={2}>
          <CircularProgress />
        </Box>
      )}

      <EmailOTP
        open={openEmailOTP}
        onClose={() => setOpenEmailOTP(false)}
        onVerify={handleVerify}
        language={language}
      />

      <MobileOTP
        open={openMobileOTP}
        onClose={() => setOpenMobileOTP(false)}
        onVerify={handleVerify}
        language={language}
      />
    </div>
  );
};

export default LanguageSelector;
