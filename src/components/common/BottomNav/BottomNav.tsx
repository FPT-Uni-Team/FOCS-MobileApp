import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface MenuItem { key:string; icon:string; }
const MENU: MenuItem[]=[{key:'table',icon:'table-furniture'}];

interface Props{selected:string;onSelect:(k:string)=>void;}

const BottomNav:React.FC<Props>=({selected,onSelect})=>{
  return (
    <View style={styles.container}>
      {MENU.map(m=>{
        const active = m.key===selected;
        return (
          <TouchableOpacity key={m.key} style={styles.item} onPress={()=>onSelect(m.key)}>
            <Icon name={m.icon} size={28} color={active? '#0d6efd':'#777'}/>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles=StyleSheet.create({
  container:{
    flexDirection:'row',
    justifyContent:'space-around',
    alignItems:'center',
    paddingVertical:8,
    borderTopWidth:1,
    borderTopColor:'#e0e0e0',
    backgroundColor:'#fff',
  },
  item:{padding:8},
});
export default BottomNav; 