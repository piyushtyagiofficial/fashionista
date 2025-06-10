import { AntDesign, Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "react-native";
import SeriseriportLogo from './srisriport_logo.png';

export const icons = {
  home: (props) => <AntDesign name="home" size={26} {...props} />,
  model: (props) => <MaterialCommunityIcons name="human-female" size={26} {...props} />,
  ssp: (props) => (
    <Image
      source={SeriseriportLogo}
      style={{ width: 26, height: 26, resizeMode: 'contain', tintColor: props.color }}
    />
  ),
  products: (props) => <Feather name="shopping-bag" size={26} {...props} />,
  profile: (props) => <AntDesign name="user" size={26} {...props} />,
};
