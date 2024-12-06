import { TouchableOpacity, StyleSheet, View } from 'react-native';
import React from 'react';
import { hp } from '../helpers/common';
import theme from '../constants/theme';
import Icon from '../assets/icons';
import { useAuth } from '../contexts/AuthContext';
import { useRouter, usePathname } from 'expo-router';

const Navbar = () => {
    const { user } = useAuth(); // Get logged-in user
    const router = useRouter();
    const pathname = usePathname();

    // Check if the current path is active
    const isActive = (path) => {
        const cleanPath = pathname.split('?')[0]; // Strip query parameters
        return cleanPath === `/${path}` || cleanPath.startsWith(`/${path}`);
    };

    // Render a single navbar item
    const renderNavItem = (path, iconName) => (
        <TouchableOpacity
            style={styles.navItem}
            onPress={() => !isActive(path) && router.push(path)}
            disabled={isActive(path)} // Disable button if active
        >
            <View style={styles.iconContainer}>
                <Icon
                    name={iconName}
                    size={hp(4)}
                    strokeWidth={3}
                    color={isActive(path) ? theme.colors.Button2 : theme.colors.secondary}
                />
                {isActive(path) && <View style={styles.indicator} />}
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.navbar}>
            {renderNavItem('onHold', 'pause')}
            {renderNavItem('home', 'idea')}
            {renderNavItem('executions', 'rocket')}
        </View>
    );
};

export default Navbar;

const styles = StyleSheet.create({
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: hp(1),
        backgroundColor: theme.colors.dark,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    navItem: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        width: hp(12),
        height: hp(6),
        justifyContent: 'center',
        alignItems: 'center',
    },
    indicator: {
        width: hp(1),
        height: hp(0.5),
        backgroundColor: theme.colors.Button2,
        borderRadius: hp(0.25),
        position: 'absolute',
        bottom: -hp(0.8),
    },
});
