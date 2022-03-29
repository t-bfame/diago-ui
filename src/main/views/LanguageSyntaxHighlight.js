import React, { useReducer, useEffect, useContext } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { PageHeader, Breadcrumb } from 'antd';

import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import { UserContext } from '../../hooks/UserContext';
import getClient from '../../model/client';
import { useHistory } from 'react-router-dom';
import Page from '../../common/views/Page';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { a11yLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';

function LanguageSyntaxHighlight(props) {
    var lang = "plaintext"
    if (props.code.length > 1) {
        var first = props.code[0]
        var last = props.code[props.code.length - 1]
        console.log("first: " + first);
        console.log("last: " + last);
        var combined = first + "" + last;
        console.log("combined: " + combined);
        switch (combined) {
            case "[]":
            case "{}":
                lang = "json"
                break;
            case "<>":
                lang = "htmlbars"
                break;
        }
    }
    return (
        <SyntaxHighlighter language={lang} style={a11yLight}>
            {props.code}
        </SyntaxHighlighter>
    )
}

export default LanguageSyntaxHighlight;