import * as React from "react"
import Svg, { Circle, Path } from "react-native-svg";

const ClockIcon = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={48} height={48} color="#000000" fill="none" {...props}>
    <Circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
    <Path d="M12 8V12L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default ClockIcon;
