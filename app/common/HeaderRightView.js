import {Component} from "react";
import {Text, StyleSheet, TouchableHighlight} from "react-native";
import React from "react";


class HeaderRightView extends Component {

    constructor(props) {
        super(props)
        this.state = {
            content: this.props.content
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
            <TouchableHighlight style={styles.items} underlayColor='#666CF9' onPress={this.clickBtn.bind(this)}>
                <Text style={styles.rightBtns}>{this.state.content}</Text>
            </TouchableHighlight>
        )
    }
}

const styles = StyleSheet.create({
    items: {
        paddingLeft: 5,
    },
    rightBtns: {
        fontSize: 16,
        color: '#ffffff',
        marginRight: 15,
    },
})

export default HeaderRightView;
