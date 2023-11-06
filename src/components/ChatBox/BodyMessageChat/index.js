import React from 'react';
import classNames from 'classnames/bind';
import styles from '~/pages/ChatBox/Chatbox.module.scss';
import { getUserId } from '~/utils';
import { Avatar, Card, Typography, Image, Space } from 'antd';
import { MESSAGE_TYPE_CONVERSATION_TEXT } from '~/constants';

const { Text } = Typography;
require('moment/locale/vi');
const moment = require('moment');
const cx = classNames.bind(styles);

const BodyMessageChat = ({ messages, messagesEndRef, bodyMessageRef, conversationSelected }) => {
    var userId = +getUserId();
    if (userId === undefined || userId === null) return;


    /// styles
    const styleBodyMessage = { overflowY: 'auto', maxHeight: '50vh' }
    const styleTitleMessage = { paddingLeft: 10 }
    const styleBodyCardMessage = { padding: 10 }
    const styleMessageImage = { borderRadius: 5 }
    ///

    /// functions
    const getFullNameUserFromConversationSelected = (userId) => {
        if (!conversationSelected) return;
        const users = conversationSelected.users;
        if (!users) return;
        const userFind = users.find(x => x.userId === userId);
        if (!userFind) return;
        return userFind.fullname;
    }
    ///

    return (
        <div style={styleBodyMessage} ref={bodyMessageRef}>
            {
                messages.map((item) => (
                    <>
                        {
                            item.userId !== userId ?
                                (<div style={{ marginBottom: 25 }}>
                                    <Space align="center">
                                        <Avatar src={item.avatar} />
                                        <Space.Compact direction="vertical">
                                            <div style={styleTitleMessage}>
                                                {conversationSelected.isGroup ? <Text type="secondary" style={{ marginBottom: 5 }}>{getFullNameUserFromConversationSelected(item.userId)}</Text> : <></>}
                                            </div>
                                            <Card className={cx('card-message')} bodyStyle={styleBodyCardMessage}>
                                                {item.messageType === MESSAGE_TYPE_CONVERSATION_TEXT ? <p>{item.content}</p> : <Image style={styleMessageImage} width={150} src={item.content} />}
                                            </Card>
                                            <div style={styleTitleMessage}>
                                                <Text type="secondary">{moment(item.dateCreate).format('HH:mm - DD/MM')}</Text>
                                            </div>
                                        </Space.Compact>
                                    </Space>
                                </div>)
                                :
                                (<div style={{ marginBottom: 25, position: 'relative' }}>
                                    <div className={cx('style-message-sender-1')}>
                                        <Card className={cx('card-message-sender')} bodyStyle={styleBodyCardMessage}>
                                            <Space align="center">
                                                {item.messageType === MESSAGE_TYPE_CONVERSATION_TEXT ? <p className={cx('text-color-message')}>{item.content}</p> : <Image style={styleMessageImage} width={150} src={item.content} />}
                                            </Space>
                                        </Card>
                                        <Text type="secondary">{moment(item.dateCreate).format('HH:mm - DD/MM')}</Text>
                                    </div>

                                </div>)
                        }
                    </>
                ))
            }
            <div ref={messagesEndRef} />
        </div>
    )
}

export default BodyMessageChat;