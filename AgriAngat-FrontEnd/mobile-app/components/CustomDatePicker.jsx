import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import PropTypes from 'prop-types';

const CustomDatePicker = ({ 
  value, 
  onChange, 
  visible, 
  onClose, 
  maximumDate = new Date(),
  placeholder = "Select Date"
}) => {
  const [tempDate, setTempDate] = useState(value || new Date());

  // Update tempDate when value changes
  React.useEffect(() => {
    if (value) {
      setTempDate(value);
    } else {
      setTempDate(new Date());
    }
  }, [value]);

  const handleCancel = () => {
    setTempDate(value || new Date());
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
              <Text style={styles.headerButtonText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Select Date</Text>
            <TouchableOpacity onPress={() => {
              // Finalize the current selection
              onChange(tempDate);
              onClose();
            }} style={styles.headerButton}>
              <Text style={[styles.headerButtonText, styles.clearText]}>Done</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.pickerContainer}>
            <View style={styles.pickerScale}>
              <DateTimePicker
                value={tempDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => {
                  if (selectedDate) {
                    setTempDate(selectedDate);
                  }
                }}
                maximumDate={maximumDate}
                style={styles.picker}
                textColor="#333"
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  headerButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  headerButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#666',
  },
  clearText: {
    color: '#007AFF',
    fontFamily: 'Poppins-Bold',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#333',
  },
  pickerContainer: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  picker: {
    width: 200,
    height: 100,
    color: '#333',
  },
  pickerScale: {
    transform: [{ scale: 0.9 }],
  },
});

export default CustomDatePicker;

CustomDatePicker.propTypes = {
  value: PropTypes.instanceOf(Date),
  onChange: PropTypes.func,
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  maximumDate: PropTypes.instanceOf(Date),
  placeholder: PropTypes.string,
};
