import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import PropTypes from 'prop-types';

const CustomPicker = ({
  selectedValue,
  onValueChange,
  items,
  placeholder = 'Select an option',
  style,
  title = 'Select Option',
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedItem = items?.find((it) => it.value === selectedValue);
  const displayText = selectedItem ? selectedItem.label : placeholder;

  return (
    <>
      <TouchableOpacity
        style={[styles.pickerButton, style]}
        onPress={() => setModalVisible(true)}
      >
        <Text
          style={[
            styles.pickerButtonText,
            selectedValue ? styles.selectedText : styles.placeholderText,
          ]}
          numberOfLines={1}
        >
          {displayText}
        </Text>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.container}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.headerButton}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.title}>{title}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={[styles.headerButton, styles.confirmText]}>Done</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedValue}
                onValueChange={(value) => {
                  onValueChange?.(value);
                }}
                style={styles.picker}
                itemStyle={styles.pickerItem}
              >
                {(items || []).map((item, index) => (
                  <Picker.Item
                    key={`${item.value}-${index}`}
                    label={item.label}
                    value={item.value}
                    color="#333"
                  />
                ))}
              </Picker>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  pickerButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    flex: 1,
  },
  selectedText: {
    color: '#333',
  },
  placeholderText: {
    color: '#9aa0a6',
  },
  arrow: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  headerButton: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#666',
  },
  confirmText: {
    color: '#007AFF',
    fontFamily: 'Poppins-Bold',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#333',
  },
  pickerContainer: {
    paddingVertical: 10,
  },
  picker: {
    height: 175,
    color: '#333',
  },
  pickerItem: {
    color: '#333',
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
  },
});

CustomPicker.propTypes = {
  selectedValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onValueChange: PropTypes.func,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    })
  ),
  placeholder: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  title: PropTypes.string,
};

export default CustomPicker;


