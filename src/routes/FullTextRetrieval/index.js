import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { getRoutes } from '../../utils/utils';
import { List, Avatar, Icon } from 'antd';

@connect(({search})=>({
    searchresult:search.searchresult
}))
export class FullTextRetrieval extends Component{
    
    render()
    {
        return (
            <div>
              <List>
                {data.map((item, i) => {
                  const itemCls = classNames(styles.item, {
                    [styles.read]: item.read,
                  });
                  return (
                    <List.Item className={itemCls} key={item.key || i} onClick={() => onClick(item)}>
                      <List.Item.Meta
                        className={styles.meta}
                        avatar={item.avatar ? <Avatar className={styles.avatar} src={item.avatar} /> : null}
                        title={
                          <div className={styles.title}>
                            {item.title}
                            <div className={styles.extra}>{item.extra}</div>
                          </div>
                        }
                        description={
                          <div>
                            <div className={styles.description} title={item.description}>
                              {item.description}
                            </div>
                            <div className={styles.datetime}>{item.datetime}</div>
                          </div>
                        }
                      />
                    </List.Item>
                  );
                })}
              </List>
              {
                isshowclear?<div className={styles.clear} onClick={onClear}>
                {locale.clear}{title}
              </div>:null
              }
            </div>
          );
    }
}

 
 
