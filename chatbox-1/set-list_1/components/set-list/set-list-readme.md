## set-list 设置列表组件
> **组件名：set-list**
> 
> 图标已经集成到组件里面，不需要另外设置。
> 
> 调用代码块： `<set-list :list="list"></set-list>`

使用步骤：  
1、导入插件  
2、在需要调用的地方输入`<set-list:list="list"></set-list>`  
3、复制下面代码块到调用页面，name为列表每一项的名称，url为点击之后要打开的路径。


```
data() {
			return {
				list: [{
						name: "账号与安全",
						url:"../../pages/user-set-repassword/user-set-repassword"
					},
					{
						name: "绑定手机",
						url:""
					},
					{
						name: "绑定邮箱",
						url:""
					},
					{
						name: "资料编辑",
						url:""
					},
					{
						name: "清除缓存",
						url:""
					},
					{
						name: "意见反馈",
						url:""
					},
					{
						name: "关于APP",
						url:""
					},
				]
			}
		},

```