import {Component} from "react";
import {Image, StyleSheet, TouchableOpacity} from "react-native";
import React from "react";


class HeaderLeftView extends Component {

    constructor(props) {
        super(props)
        this.state = {

        };
    }

    /**
     *
     */
    clickBtn(){
        this.props.clickBtn();
    }

    render() {
        return (
            <TouchableOpacity activeOpacity={0.5} onPress={this.clickBtn.bind(this)}>
                <Image source={require('../img/back.png')} style={styles.left_header_btn}/>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    left_header_btn: {
        height: 20,
        width: 30,
        margin: 5,
        resizeMode: 'contain',
    },
})

export default HeaderLeftView;
