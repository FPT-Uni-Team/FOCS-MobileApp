import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../../utils/Colors';
import { spacing } from '../../../utils/spacing';

export interface DisplayImage {
  url: string;
  is_main: boolean;
  uid?: string;
}

interface ImageShowGridProps {
  initialImages: DisplayImage[];
}

const { width } = Dimensions.get('window');
const GRID_SIZE = (width - 48) / 2; // 2 columns with margins
const MAX_DISPLAY_SLOTS = 4;

const ImageShowGrid: React.FC<ImageShowGridProps> = ({ initialImages }) => {
  const [displayImages, setDisplayImages] = useState<DisplayImage[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const processedImages =
      initialImages?.map((img, index) => ({
        ...img,
        uid: img.uid || `image-${index}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      })) || [];
    setDisplayImages(processedImages);
  }, [initialImages]);

  const openImageModal = (index: number) => {
    setSelectedImageIndex(index);
    setModalVisible(true);
  };



  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>
        Images
      </Text>
      <View style={styles.grid}>
        {Array.from({ length: MAX_DISPLAY_SLOTS }, (_, i) => {
          const image = displayImages[i] || null;
          return (
            <TouchableOpacity
              key={`image-cell-${i}`}
              style={[styles.cell, !image && styles.emptyCell]}
              onPress={() => image && openImageModal(i)}
              disabled={!image}
            >
              {image ? (
                <>
                  <Image source={{ uri: image.url }} style={styles.image} resizeMode="cover" />
                  {image.is_main && (
                    <View style={styles.mainBadge}>
                      <Icon name="star" size={16} color="#FFD700" />
                    </View>
                  )}
                </>
              ) : (
                <View style={styles.emptyContent}>
                  <Text style={styles.emptyText}>Empty</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              style={styles.imageScroll}
              contentOffset={{ x: selectedImageIndex * width, y: 0 }}
            >
              {displayImages.map((image, index) => (
                <View key={`modal-image-${index}`} style={styles.fullImageContainer}>
                  <Image source={{ uri: image.url }} style={styles.fullImage} resizeMode="contain" />
                  {image.is_main && (
                    <View style={styles.fullMainBadge}>
                      <Icon name="star" size={20} color="#FFD700" />
                      <Text style={styles.mainText}>Main Image</Text>
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Icon name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    marginBottom: spacing.l,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cell: {
    width: GRID_SIZE,
    height: GRID_SIZE,
    marginBottom: spacing.l,
    borderRadius: spacing.s,
    overflow: 'hidden',
    position: 'relative',
  },
  emptyCell: {
    backgroundColor: Colors.backgroundSecondary,
    borderWidth: 2,
    borderColor: Colors.borderMuted,
    borderStyle: 'dashed',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  mainBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 12,
    padding: 4,
  },
  emptyContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    flex: 1,
    width: '100%',
    position: 'relative',
  },
  imageScroll: {
    flex: 1,
  },
  fullImageContainer: {
    width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  fullImage: {
    width: width - 32,
    height: '70%',
  },
  fullMainBadge: {
    position: 'absolute',
    bottom: 100,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainText: {
    color: '#fff',
    marginLeft: 4,
    fontSize: 14,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    padding: 8,
  },
});

export default ImageShowGrid; 