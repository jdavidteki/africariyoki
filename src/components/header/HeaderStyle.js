import { StyleSheet } from 'react-native';

export const styles = (styleSettings) => StyleSheet.create({
    header: {
        zIndex: 999,
        width: '100%',
        marginTop: 16,
        marginLeft: 'auto',
        marginRight: 'auto',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        maxHeight: 80,
    },

    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: styleSettings.mode == "simple" ? 'center' : 'space-between',
        padding: 8,
        width: styleSettings.mode == "simple" ? 320 : '100%',
        backgroundColor: '#f7f8e4',
        borderRadius: 4,
        minHeight: 80,
    },

    logo: {
        height: 50,
        width: 250,
        cursor: 'pointer',
    },

    left: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        minHeight: 50,
    },

    right: {
        flexGrow: 2,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        cursor: 'pointer'
    },

    navLink: {
        paddingLeft: 8,
        paddingRight: 8,
        fontWeight: 'bold',
        textAlign: 'center',
        backgroundColor: styleSettings.karoakeTabClicked ? '#f0be35' : 'none',
        marginTop: styleSettings.karoakeTabClicked ? -13 : 0,
        marginBottom: styleSettings.karoakeTabClicked ? -12 : 0,
        paddingTop: styleSettings.karoakeTabClicked ? 31 : 0,
        paddingBottom: styleSettings.karoakeTabClicked ? 32 : 0,
    }
})
