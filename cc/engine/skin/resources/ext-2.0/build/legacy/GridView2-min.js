/*
 * Ext JS Library 2.0
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */

Ext.grid.GridView=function(A){Ext.grid.GridView.superclass.constructor.call(this);this.el=null;Ext.apply(this,A)};Ext.extend(Ext.grid.GridView,Ext.grid.AbstractGridView,{rowClass:"x-grid-row",cellClass:"x-grid-col",tdClass:"x-grid-td",hdClass:"x-grid-hd",splitClass:"x-grid-split",sortClasses:["sort-asc","sort-desc"],enableMoveAnim:false,hlColor:"C3DAF9",dh:Ext.DomHelper,fly:Ext.Element.fly,css:Ext.util.CSS,borderWidth:1,splitOffset:3,scrollIncrement:22,cellRE:/(?:.*?)x-grid-(?:hd|cell|csplit)-(?:[\d]+)-([\d]+)(?:.*?)/,findRE:/\s?(?:x-grid-hd|x-grid-col|x-grid-csplit)\s/,getEditorParent:function(A){return A.parentEl||document.body},bind:function(B,A){if(this.ds){this.ds.un("load",this.onLoad,this);this.ds.un("datachanged",this.onDataChange);this.ds.un("add",this.onAdd);this.ds.un("remove",this.onRemove);this.ds.un("update",this.onUpdate);this.ds.un("clear",this.onClear)}if(B){B.on("load",this.onLoad,this);B.on("datachanged",this.onDataChange,this);B.on("add",this.onAdd,this);B.on("remove",this.onRemove,this);B.on("update",this.onUpdate,this);B.on("clear",this.onClear,this)}this.ds=B;if(this.cm){this.cm.un("widthchange",this.onColWidthChange,this);this.cm.un("headerchange",this.onHeaderChange,this);this.cm.un("hiddenchange",this.onHiddenChange,this);this.cm.un("columnmoved",this.onColumnMove,this);this.cm.un("columnlockchange",this.onColumnLock,this)}if(A){this.generateRules(A);A.on("widthchange",this.onColWidthChange,this);A.on("headerchange",this.onHeaderChange,this);A.on("hiddenchange",this.onHiddenChange,this);A.on("columnmoved",this.onColumnMove,this);A.on("columnlockchange",this.onColumnLock,this)}this.cm=A},init:function(A){Ext.grid.GridView.superclass.init.call(this,A);this.bind(A.dataSource,A.colModel);A.on("headerclick",this.handleHeaderClick,this);if(A.trackMouseOver){A.on("mouseover",this.onRowOver,this);A.on("mouseout",this.onRowOut,this)}A.cancelTextSelection=function(){};this.gridId=A.id;var B=this.templates||{};if(!B.master){B.master=new Ext.Template("<div class=\"x-grid\" hidefocus=\"true\">","<div class=\"x-grid-topbar\"></div>","<div class=\"x-grid-scroller\"><div></div></div>","<div class=\"x-grid-locked\">","<div class=\"x-grid-header\">{lockedHeader}</div>","<div class=\"x-grid-body\">{lockedBody}</div>","</div>","<div class=\"x-grid-viewport\">","<div class=\"x-grid-header\">{header}</div>","<div class=\"x-grid-body\">{body}</div>","</div>","<div class=\"x-grid-bottombar\"></div>","<a href=\"#\" class=\"x-grid-focus\" tabIndex=\"-1\"></a>","<div class=\"x-grid-resize-proxy\">&#160;</div>","</div>");B.master.disableformats=true}if(!B.header){B.header=new Ext.Template("<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\">","<tbody><tr class=\"x-grid-hd-row\">{cells}</tr></tbody>","</table>{splits}");B.header.disableformats=true}B.header.compile();if(!B.hcell){B.hcell=new Ext.Template("<td class=\"x-grid-hd x-grid-td-{id} {cellId}\"><div title=\"{title}\" class=\"x-grid-hd-inner x-grid-hd-{id}\">","<div class=\"x-grid-hd-text\" unselectable=\"on\">{value}<img class=\"x-grid-sort-icon\" src=\"",Ext.BLANK_IMAGE_URL,"\" /></div>","</div></td>");B.hcell.disableFormats=true}B.hcell.compile();if(!B.hsplit){B.hsplit=new Ext.Template("<div class=\"x-grid-split {splitId} x-grid-split-{id}\" style=\"{style}\" unselectable=\"on\">&#160;</div>");B.hsplit.disableFormats=true}B.hsplit.compile();if(!B.body){B.body=new Ext.Template("<table border=\"0\" cellspacing=\"0\" cellpadding=\"0\">","<tbody>{rows}</tbody>","</table>");B.body.disableFormats=true}B.body.compile();if(!B.row){B.row=new Ext.Template("<tr class=\"x-grid-row {alt}\">{cells}</tr>");B.row.disableFormats=true}B.row.compile();if(!B.cell){B.cell=new Ext.Template("<td class=\"x-grid-col x-grid-td-{id} {cellId} {css}\" tabIndex=\"0\">","<div class=\"x-grid-col-{id} x-grid-cell-inner\"><div class=\"x-grid-cell-text\" unselectable=\"on\" {attr}>{value}</div></div>","</td>");B.cell.disableFormats=true}B.cell.compile();this.templates=B},onColWidthChange:function(){this.updateColumns.apply(this,arguments)},onHeaderChange:function(){this.updateHeaders.apply(this,arguments)},onHiddenChange:function(){this.handleHiddenChange.apply(this,arguments)},onColumnMove:function(){this.handleColumnMove.apply(this,arguments)},onColumnLock:function(){this.handleLockChange.apply(this,arguments)},onDataChange:function(){this.refresh();this.updateHeaderSortState()},onClear:function(){this.refresh()},onUpdate:function(B,A){this.refreshRow(A)},refreshRow:function(A){var C=this.ds,B;if(typeof A=="number"){B=A;A=C.getAt(B)}else{B=C.indexOf(A)}this.insertRows(C,B,B,true);this.onRemove(C,A,B+1,true);this.syncRowHeights(B,B);this.layout();this.fireEvent("rowupdated",this,B,A)},onAdd:function(C,A,B){this.insertRows(C,B,B+(A.length-1))},onRemove:function(F,B,D,E){if(E!==true){this.fireEvent("beforerowremoved",this,D,B)}var C=this.getBodyTable(),A=this.getLockedTable();if(C.rows[D]){C.firstChild.removeChild(C.rows[D])}if(A.rows[D]){A.firstChild.removeChild(A.rows[D])}if(E!==true){this.stripeRows(D);this.syncRowHeights(D,D);this.layout();this.fireEvent("rowremoved",this,D,B)}},onLoad:function(){this.scrollToTop()},scrollToTop:function(){if(this.scroller){this.scroller.dom.scrollTop=0;this.syncScroll()}},getHeaderPanel:function(A){if(A){this.headerPanel.show()}return this.headerPanel},getFooterPanel:function(A){if(A){this.footerPanel.show()}return this.footerPanel},initElements:function(){var C=Ext.Element;var B=this.grid.getGridEl().dom.firstChild;var A=B.childNodes;this.el=new C(B);this.headerPanel=new C(B.firstChild);this.headerPanel.enableDisplayMode("block");this.scroller=new C(A[1]);this.scrollSizer=new C(this.scroller.dom.firstChild);this.lockedWrap=new C(A[2]);this.lockedHd=new C(this.lockedWrap.dom.firstChild);this.lockedBody=new C(this.lockedWrap.dom.childNodes[1]);this.mainWrap=new C(A[3]);this.mainHd=new C(this.mainWrap.dom.firstChild);this.mainBody=new C(this.mainWrap.dom.childNodes[1]);this.footerPanel=new C(A[4]);this.footerPanel.enableDisplayMode("block");this.focusEl=new C(A[5]);this.focusEl.swallowEvent("click",true);this.resizeProxy=new C(A[6]);this.headerSelector=String.format("#{0} td.x-grid-hd, #{1} td.x-grid-hd",this.lockedHd.id,this.mainHd.id);this.splitterSelector=String.format("#{0} div.x-grid-split, #{1} div.x-grid-split",this.lockedHd.id,this.mainHd.id)},getHeaderCell:function(A){return Ext.DomQuery.select(this.headerSelector)[A]},getHeaderCellMeasure:function(A){return this.getHeaderCell(A).firstChild},getHeaderCellText:function(A){return this.getHeaderCell(A).firstChild.firstChild},getLockedTable:function(){return this.lockedBody.dom.firstChild},getBodyTable:function(){return this.mainBody.dom.firstChild},getLockedRow:function(A){return this.getLockedTable().rows[A]},getRow:function(A){return this.getBodyTable().rows[A]},getRowComposite:function(B){if(!this.rowEl){this.rowEl=new Ext.CompositeElementLite()}var D=[],C,A;if(C=this.getLockedRow(B)){D.push(C)}if(A=this.getRow(B)){D.push(A)}this.rowEl.elements=D;return this.rowEl},getCell:function(D,B){var A=this.cm.getLockedCount();var C;if(B<A){C=this.lockedBody.dom.firstChild}else{C=this.mainBody.dom.firstChild;B-=A}return C.rows[D].childNodes[B]},getCellText:function(B,A){return this.getCell(B,A).firstChild.firstChild},getCellBox:function(B){var A=this.fly(B).getBox();if(Ext.isOpera){A.y=B.offsetTop+this.mainBody.getY()}return A},getCellIndex:function(A){var B=String(A.className).match(this.cellRE);if(B){return parseInt(B[1],10)}return 0},findHeaderIndex:function(B){var A=Ext.fly(B).findParent("td."+this.hdClass,6);return A?this.getCellIndex(A):false},findHeaderCell:function(B){var A=Ext.fly(B).findParent("td."+this.hdClass,6);return A?A:false},findRowIndex:function(B){if(!B){return false}var A=Ext.fly(B).findParent("tr."+this.rowClass,6);return A?A.rowIndex:false},findCellIndex:function(B){var A=this.el.dom;while(B&&B!=A){if(this.findRE.test(B.className)){return this.getCellIndex(B)}B=B.parentNode}return false},getColumnId:function(A){return this.cm.getColumnId(A)},getSplitters:function(){if(this.splitterSelector){return Ext.DomQuery.select(this.splitterSelector)}else{return null}},getSplitter:function(A){return this.getSplitters()[A]},onRowOver:function(B,A){var C;if((C=this.findRowIndex(A))!==false){this.getRowComposite(C).addClass("x-grid-row-over")}},onRowOut:function(B,A){var C;if((C=this.findRowIndex(A))!==false&&C!==this.findRowIndex(B.getRelatedTarget())){this.getRowComposite(C).removeClass("x-grid-row-over")}},renderHeaders:function(){var J=this.cm;var F=this.templates.hcell,I=this.templates.header,K=this.templates.hsplit;var D=[],B=[],H=[],C=[],A={};for(var E=0,G=J.getColumnCount();E<G;E++){A.cellId="x-grid-hd-0-"+E;A.splitId="x-grid-csplit-0-"+E;A.id=J.getColumnId(E);A.title=J.getColumnTooltip(E)||"";A.value=J.getColumnHeader(E)||"";A.style=(this.grid.enableColumnResize===false||!J.isResizable(E)||J.isFixed(E))?"cursor:default":"";if(!J.isLocked(E)){D[D.length]=F.apply(A);H[H.length]=K.apply(A)}else{B[B.length]=F.apply(A);C[C.length]=K.apply(A)}}return[I.apply({cells:B.join(""),splits:C.join("")}),I.apply({cells:D.join(""),splits:H.join("")})]},updateHeaders:function(){var A=this.renderHeaders();this.lockedHd.update(A[0]);this.mainHd.update(A[1])},focusRow:function(B){var A=this.scroller.dom.scrollLeft;this.focusCell(B,0,false);this.scroller.dom.scrollLeft=A},focusCell:function(D,A,C){var B=this.ensureVisible(D,A,C);this.focusEl.alignTo(B,"tl-tl");if(Ext.isGecko){this.focusEl.focus()}else{this.focusEl.focus.defer(1,this.focusEl)}},ensureVisible:function(O,E,D){if(typeof O!="number"){O=O.rowIndex}if(O<0&&O>=this.ds.getCount()){return }E=(E!==undefined?E:0);var M=this.grid.colModel;while(M.isHidden(E)){E++}var C=this.getCell(O,E);if(!C){return }var J=this.scroller.dom;var N=parseInt(C.offsetTop,10);var I=parseInt(C.offsetLeft,10);var L=N+C.offsetHeight;var G=I+C.offsetWidth;var A=J.clientHeight-this.mainHd.dom.offsetHeight;var K=parseInt(J.scrollTop,10);var F=parseInt(J.scrollLeft,10);var H=K+A;var B=F+J.clientWidth;if(N<K){J.scrollTop=N}else{if(L>H){J.scrollTop=L-A}}if(D!==false){if(I<F){J.scrollLeft=I}else{if(G>B){J.scrollLeft=G-J.clientWidth}}}return C},updateColumns:function(){this.grid.stopEditing();var B=this.grid.colModel,E=this.getColumnIds();var F=0;for(var D=0,A=B.getColumnCount();D<A;D++){var C=B.getColumnWidth(D);this.css.updateRule(this.colSelector+E[D],"width",(C-this.borderWidth)+"px");this.css.updateRule(this.hdSelector+E[D],"width",(C-this.borderWidth)+"px")}this.updateSplitters()},generateRules:function(B){var C=[];for(var D=0,A=B.getColumnCount();D<A;D++){var H=B.getColumnId(D);var G="";if(B.config[D].align){G="text-align:"+B.config[D].align+";"}var F="";if(B.isHidden(D)){F="display:none;"}var E="width:"+(B.getColumnWidth(D)-this.borderWidth)+"px;";C.push(this.colSelector,H," {\n",B.config[D].css,G,E,"\n}\n",this.hdSelector,H," {\n",G,E,"}\n",this.tdSelector,H," {\n",F,"\n}\n",this.splitSelector,H," {\n",F,"\n}\n")}return Ext.util.CSS.createStyleSheet(C.join(""))},updateSplitters:function(){var B=this.cm,F=this.getSplitters();if(F){var G=0,D=true;for(var E=0,A=B.getColumnCount();E<A;E++){if(B.isHidden(E)){continue}var C=B.getColumnWidth(E);if(!B.isLocked(E)&&D){G=0;D=false}G+=C;F[E].style.left=(G-this.splitOffset)+"px"}}},handleHiddenChange:function(B,A,C){if(C){this.hideColumn(A)}else{this.unhideColumn(A)}},hideColumn:function(A){var B=this.getColumnId(A);this.css.updateRule(this.tdSelector+B,"display","none");this.css.updateRule(this.splitSelector+B,"display","none");if(Ext.isSafari){this.updateHeaders()}this.updateSplitters();this.layout()},unhideColumn:function(A){var B=this.getColumnId(A);this.css.updateRule(this.tdSelector+B,"display","");this.css.updateRule(this.splitSelector+B,"display","");if(Ext.isSafari){this.updateHeaders()}this.updateSplitters();this.layout()},insertRows:function(B,F,D,E){if(F==0&&D==B.getCount()-1){this.refresh()}else{if(!E){this.fireEvent("beforerowsinserted",this,F,D)}var C=this.getScrollState();var A=this.renderRows(F,D);this.bufferRows(A[0],this.getLockedTable(),F);this.bufferRows(A[1],this.getBodyTable(),F);this.restoreScroll(C);if(!E){this.fireEvent("rowsinserted",this,F,D);this.syncRowHeights(F,D);this.stripeRows(F);this.layout()}}},bufferRows:function(I,E,D){var G=null,H=E.rows,B=E.tBodies[0];if(D<H.length){G=H[D]}var F=document.createElement("div");F.innerHTML="<table><tbody>"+I+"</tbody></table>";var J=F.firstChild.rows;for(var A=0,C=J.length;A<C;A++){if(G){B.insertBefore(J[0],G)}else{B.appendChild(J[0])}}F.innerHTML="";F=null},deleteRows:function(B,F,D){if(B.getRowCount()<1){this.fireEvent("beforerefresh",this);this.mainBody.update("");this.lockedBody.update("");this.fireEvent("refresh",this)}else{this.fireEvent("beforerowsdeleted",this,F,D);var A=this.getBodyTable();var C=A.firstChild;var E=A.rows;for(var G=F;G<=D;G++){C.removeChild(E[F])}this.stripeRows(F);this.fireEvent("rowsdeleted",this,F,D)}},updateRows:function(D,C,B){var A=this.getScrollState();this.refresh();this.restoreScroll(A)},handleSort:function(D,C,A,B){if(!B){this.refresh()}this.updateHeaderSortState()},getScrollState:function(){var A=this.scroller.dom;return{left:A.scrollLeft,top:A.scrollTop}},stripeRows:function(F){if(!this.grid.stripeRows||this.ds.getCount()<1){return }F=F||0;var J=this.getBodyTable().rows;var D=this.getLockedTable().rows;var G=" x-grid-row-alt ";for(var B=F,C=J.length;B<C;B++){var I=J[B],E=D[B];var A=((B+1)%2==0);var H=(" "+I.className+" ").indexOf(G)!=-1;if(A==H){continue}if(A){I.className+=" x-grid-row-alt"}else{I.className=I.className.replace("x-grid-row-alt","")}if(E){E.className=I.className}}},restoreScroll:function(A){var B=this.scroller.dom;B.scrollLeft=A.left;B.scrollTop=A.top;this.syncScroll()},syncScroll:function(){var D=this.scroller.dom;var B=this.mainHd.dom;var A=this.mainBody.dom;var C=this.lockedBody.dom;B.scrollLeft=A.scrollLeft=D.scrollLeft;C.scrollTop=A.scrollTop=D.scrollTop},handleScroll:function(A){this.syncScroll();var B=this.scroller.dom;this.grid.fireEvent("bodyscroll",B.scrollLeft,B.scrollTop);A.stopEvent()},handleWheel:function(A){var B=A.getWheelDelta();this.scroller.dom.scrollTop-=B*22;this.lockedBody.dom.scrollTop=this.mainBody.dom.scrollTop=this.scroller.dom.scrollTop;A.stopEvent()},renderRows:function(J,D){var F=this.grid,H=F.colModel,B=F.dataSource,K=F.stripeRows;var I=H.getColumnCount();if(B.getCount()<1){return["",""]}var G=[];for(var E=0;E<I;E++){var A=H.getDataIndex(E);G[E]={name:typeof A=="undefined"?B.fields.get(E).name:A,renderer:H.getRenderer(E),id:H.getColumnId(E),locked:H.isLocked(E)}}J=J||0;D=typeof D=="undefined"?B.getCount()-1:D;var C=B.getRange(J,D);return this.doRender(G,C,B,J,I,K)},doRender:Ext.isGecko?function(D,G,L,A,K,P){var B=this.templates,C=B.cell,E=B.row;var T="",W="",M,F,U,N={},H={},J,I;for(var O=0,R=G.length;O<R;O++){J=G[O];M="";F="";I=(O+A);for(var Q=0;Q<K;Q++){U=D[Q];N.cellId="x-grid-cell-"+I+"-"+Q;N.id=U.id;N.css=N.attr="";N.value=U.renderer(J.data[U.name],N,J,I,Q,L);if(N.value==undefined||N.value===""){N.value="&#160;"}if(J.dirty&&typeof J.modified[U.name]!=="undefined"){N.css+=N.css?" x-grid-dirty-cell":"x-grid-dirty-cell"}var S=C.apply(N);if(!U.locked){M+=S}else{F+=S}}var V=[];if(P&&((I+1)%2==0)){V[0]="x-grid-row-alt"}if(J.dirty){V[1]=" x-grid-dirty-row"}H.cells=F;if(this.getRowClass){V[2]=this.getRowClass(J,I)}H.alt=V.join(" ");W+=E.apply(H);H.cells=M;T+=E.apply(H)}return[W,T]}:function(D,G,L,A,K,P){var B=this.templates,C=B.cell,E=B.row;var T=[],W=[],M,F,U,N={},H={},J,I;for(var O=0,R=G.length;O<R;O++){J=G[O];M=[];F=[];I=(O+A);for(var Q=0;Q<K;Q++){U=D[Q];N.cellId="x-grid-cell-"+I+"-"+Q;N.id=U.id;N.css=N.attr="";N.value=U.renderer(J.data[U.name],N,J,I,Q,L);if(N.value==undefined||N.value===""){N.value="&#160;"}if(J.dirty&&typeof J.modified[U.name]!=="undefined"){N.css+=N.css?" x-grid-dirty-cell":"x-grid-dirty-cell"}var S=C.apply(N);if(!U.locked){M[M.length]=S}else{F[F.length]=S}}var V=[];if(P&&((I+1)%2==0)){V[0]="x-grid-row-alt"}if(J.dirty){V[1]=" x-grid-dirty-row"}H.cells=F;if(this.getRowClass){V[2]=this.getRowClass(J,I)}H.alt=V.join(" ");H.cells=F.join("");W[W.length]=E.apply(H);H.cells=M.join("");T[T.length]=E.apply(H)}return[W.join(""),T.join("")]},renderBody:function(){var B=this.renderRows();var A=this.templates.body;return[A.apply({rows:B[0]}),A.apply({rows:B[1]})]},refresh:function(B){this.fireEvent("beforerefresh",this);this.grid.stopEditing();var A=this.renderBody();this.lockedBody.update(A[0]);this.mainBody.update(A[1]);if(B===true){this.updateHeaders();this.updateColumns();this.updateSplitters();this.updateHeaderSortState()}this.syncRowHeights();this.layout();this.fireEvent("refresh",this)},handleColumnMove:function(A,D,B){this.indexMap=null;var C=this.getScrollState();this.refresh(true);this.restoreScroll(C);this.afterMove(B)},afterMove:function(A){if(this.enableMoveAnim&&Ext.enableFx){this.fly(this.getHeaderCell(A).firstChild).highlight(this.hlColor)}},updateCell:function(C,E,F){var H=this.getColumnIndexByDataIndex(F);if(typeof H=="undefined"){return }var G=this.grid.colModel;var I=this.getCell(E,H);var J=this.getCellText(E,H);var A={cellId:"x-grid-cell-"+E+"-"+H,id:G.getColumnId(H),css:H==G.getColumnCount()-1?"x-grid-col-last":""};var D=G.getRenderer(H);var B=D(C.getValueAt(E,F),A,E,H,C);if(typeof B=="undefined"||B===""){B="&#160;"}J.innerHTML=B;I.className=this.cellClass+" "+A.cellId+" "+A.css;this.syncRowHeights(E,E)},calcColumnWidth:function(I,A){var H=0;if(this.grid.autoSizeHeaders){var D=this.getHeaderCellMeasure(I);H=Math.max(H,D.scrollWidth)}var B,E;if(this.cm.isLocked(I)){B=this.getLockedTable();E=I}else{B=this.getBodyTable();E=I-this.cm.getLockedCount()}if(B&&B.rows){var J=B.rows;var F=Math.min(A||J.length,J.length);for(var C=0;C<F;C++){var G=J[C].childNodes[E].firstChild;H=Math.max(H,G.scrollWidth)}}return H+5},autoSizeColumn:function(C,A,B){if(this.cm.isHidden(C)){return }if(A){var E=this.cm.getColumnId(C);this.css.updateRule(this.colSelector+E,"width",this.grid.minColumnWidth+"px");if(this.grid.autoSizeHeaders){this.css.updateRule(this.hdSelector+E,"width",this.grid.minColumnWidth+"px")}}var D=this.calcColumnWidth(C);this.cm.setColumnWidth(C,Math.max(this.grid.minColumnWidth,D),B);if(!B){this.grid.fireEvent("columnresize",C,D)}},autoSizeColumns:function(){var A=this.grid.colModel;var C=A.getColumnCount();for(var B=0;B<C;B++){this.autoSizeColumn(B,true,true)}if(A.getTotalWidth()<this.scroller.dom.clientWidth){this.fitColumns()}else{this.updateColumns();this.layout()}},fitColumns:function(C){var H=this.grid.colModel;var I=H.getColumnCount();var F=[];var B=0;var D,G;for(D=0;D<I;D++){if(!H.isHidden(D)&&!H.isFixed(D)){G=H.getColumnWidth(D);F.push(D);F.push(G);B+=G}}var E=Math.min(this.scroller.dom.clientWidth,this.el.getWidth());if(C){E-=17}var A=(E-H.getTotalWidth())/B;while(F.length){G=F.pop();D=F.pop();H.setColumnWidth(D,Math.floor(G+G*A),true)}this.updateColumns();this.layout()},onRowSelect:function(B){var A=this.getRowComposite(B);A.addClass("x-grid-row-selected")},onRowDeselect:function(B){var A=this.getRowComposite(B);A.removeClass("x-grid-row-selected")},onCellSelect:function(C,B){var A=this.getCell(C,B);if(A){Ext.fly(A).addClass("x-grid-cell-selected")}},onCellDeselect:function(C,B){var A=this.getCell(C,B);if(A){Ext.fly(A).removeClass("x-grid-cell-selected")}},updateHeaderSortState:function(){var B=this.ds.getSortState();if(!B){return }this.sortState=B;var E=this.cm.findColumnIndex(B.field);if(E!=-1){var A=B.direction;var D=this.sortClasses;var C=this.el.select(this.headerSelector).removeClass(D);C.item(E).addClass(D[A=="DESC"?1:0])}},handleHeaderClick:function(D,C){if(this.headersDisabled){return }var B=D.store,A=D.colModel;if(!A.isSortable(C)){return }D.stopEditing();B.sort(A.getDataIndex(C))},destroy:function(){if(this.colMenu){this.colMenu.removeAll();Ext.menu.MenuMgr.unregister(this.colMenu);this.colMenu.getEl().remove();delete this.colMenu}if(this.hmenu){this.hmenu.removeAll();Ext.menu.MenuMgr.unregister(this.hmenu);this.hmenu.getEl().remove();delete this.hmenu}if(this.grid.enableColumnMove){var C=Ext.dd.DDM.ids["gridHeader"+this.grid.getGridEl().id];if(C){for(var A in C){if(!C[A].config.isTarget&&C[A].dragElId){var B=C[A].dragElId;C[A].unreg();Ext.get(B).remove()}else{if(C[A].config.isTarget){C[A].proxyTop.remove();C[A].proxyBottom.remove();C[A].unreg()}}if(Ext.dd.DDM.locationCache[A]){delete Ext.dd.DDM.locationCache[A]}}delete Ext.dd.DDM.ids["gridHeader"+this.grid.getGridEl().id]}}this.bind(null,null);Ext.EventManager.removeResizeListener(this.onWindowResize,this)},handleLockChange:function(){this.refresh(true)},onDenyColumnLock:function(){},onDenyColumnHide:function(){},handleHdMenuClick:function(D){var B=this.hdCtxIndex;var A=this.cm,E=this.ds;switch(D.id){case"asc":E.sort(A.getDataIndex(B),"ASC");break;case"desc":E.sort(A.getDataIndex(B),"DESC");break;case"lock":var C=A.getLockedCount();if(A.getColumnCount(true)<=C+1){this.onDenyColumnLock();return }if(C!=B){A.setLocked(B,true,true);A.moveColumn(B,C);this.grid.fireEvent("columnmove",B,C)}else{A.setLocked(B,true)}break;case"unlock":var C=A.getLockedCount();if((C-1)!=B){A.setLocked(B,false,true);A.moveColumn(B,C-1);this.grid.fireEvent("columnmove",B,C-1)}else{A.setLocked(B,false)}break;default:B=A.getIndexById(D.id.substr(4));if(B!=-1){if(D.checked&&A.getColumnCount(true)<=1){this.onDenyColumnHide();return false}A.setHidden(B,D.checked)}}return true},beforeColMenuShow:function(){var A=this.cm,C=A.getColumnCount();this.colMenu.removeAll();for(var B=0;B<C;B++){this.colMenu.add(new Ext.menu.CheckItem({id:"col-"+A.getColumnId(B),text:A.getColumnHeader(B),checked:!A.isHidden(B),hideOnClick:false}))}},handleHdCtx:function(D,C,F){F.stopEvent();var E=this.getHeaderCell(C);this.hdCtxIndex=C;var B=this.hmenu.items,A=this.cm;B.get("asc").setDisabled(!A.isSortable(C));B.get("desc").setDisabled(!A.isSortable(C));if(this.grid.enableColLock!==false){B.get("lock").setDisabled(A.isLocked(C));B.get("unlock").setDisabled(!A.isLocked(C))}this.hmenu.show(E,"tl-bl")},handleHdOver:function(B){var A=this.findHeaderCell(B.getTarget());if(A&&!this.headersDisabled){if(this.grid.colModel.isSortable(this.getCellIndex(A))){this.fly(A).addClass("x-grid-hd-over")}}},handleHdOut:function(B){var A=this.findHeaderCell(B.getTarget());if(A){this.fly(A).removeClass("x-grid-hd-over")}},handleSplitDblClick:function(C,B){var A=this.getCellIndex(B);if(this.grid.enableColumnResize!==false&&this.cm.isResizable(A)&&!this.cm.isFixed(A)){this.autoSizeColumn(A,true);this.layout()}},render:function(){var B=this.cm;var D=B.getColumnCount();if(this.grid.monitorWindowResize===true){Ext.EventManager.onWindowResize(this.onWindowResize,this,true)}var E=this.renderHeaders();var A=this.templates.body.apply({rows:""});var C=this.templates.master.apply({lockedBody:A,body:A,lockedHeader:E[0],header:E[1]});this.grid.getGridEl().dom.innerHTML=C;this.initElements();this.scroller.on("scroll",this.handleScroll,this);this.lockedBody.on("mousewheel",this.handleWheel,this);this.mainBody.on("mousewheel",this.handleWheel,this);this.mainHd.on("mouseover",this.handleHdOver,this);this.mainHd.on("mouseout",this.handleHdOut,this);this.mainHd.on("dblclick",this.handleSplitDblClick,this,{delegate:"."+this.splitClass});this.lockedHd.on("mouseover",this.handleHdOver,this);this.lockedHd.on("mouseout",this.handleHdOut,this);this.lockedHd.on("dblclick",this.handleSplitDblClick,this,{delegate:"."+this.splitClass});if(this.grid.enableColumnResize!==false&&Ext.grid.SplitDragZone){new Ext.grid.SplitDragZone(this.grid,this.lockedHd.dom,this.mainHd.dom)}this.updateSplitters();if(this.grid.enableColumnMove&&Ext.grid.HeaderDragZone){new Ext.grid.HeaderDragZone(this.grid,this.lockedHd.dom,this.mainHd.dom);new Ext.grid.HeaderDropZone(this.grid,this.lockedHd.dom,this.mainHd.dom)}if(this.grid.enableCtxMenu!==false&&Ext.menu.Menu){this.hmenu=new Ext.menu.Menu({id:this.grid.id+"-hctx"});this.hmenu.add({id:"asc",text:this.sortAscText,cls:"xg-hmenu-sort-asc"},{id:"desc",text:this.sortDescText,cls:"xg-hmenu-sort-desc"});if(this.grid.enableColLock!==false){this.hmenu.add("-",{id:"lock",text:this.lockText,cls:"xg-hmenu-lock"},{id:"unlock",text:this.unlockText,cls:"xg-hmenu-unlock"})}if(this.grid.enableColumnHide!==false){this.colMenu=new Ext.menu.Menu({id:this.grid.id+"-hcols-menu"});this.colMenu.on("beforeshow",this.beforeColMenuShow,this);this.colMenu.on("itemclick",this.handleHdMenuClick,this);this.hmenu.add("-",{id:"columns",text:this.columnsText,menu:this.colMenu})}this.hmenu.on("itemclick",this.handleHdMenuClick,this);this.grid.on("headercontextmenu",this.handleHdCtx,this)}if((this.grid.enableDragDrop||this.grid.enableDrag)&&Ext.grid.GridDragZone){this.dd=new Ext.grid.GridDragZone(this.grid,{ddGroup:this.grid.ddGroup||"GridDD"})}this.updateHeaderSortState();this.beforeInitialResize();this.layout(true);this.renderPhase2.defer(1,this)},renderPhase2:function(){this.refresh();if(this.grid.autoSizeColumns){this.autoSizeColumns()}},beforeInitialResize:function(){},onColumnSplitterMoved:function(C,B){this.userResized=true;var A=this.grid.colModel;A.setColumnWidth(C,B,true);var D=A.getColumnId(C);this.css.updateRule(this.colSelector+D,"width",(B-this.borderWidth)+"px");this.css.updateRule(this.hdSelector+D,"width",(B-this.borderWidth)+"px");this.updateSplitters();this.layout();this.grid.fireEvent("columnresize",C,B)},syncRowHeights:function(I,E){if(this.grid.enableRowHeightSync===true&&this.cm.getLockedCount()>0){I=I||0;var F=this.getBodyTable().rows;var H=this.getLockedTable().rows;var G=F.length-1;E=Math.min(E||G,G);for(var C=I;C<=E;C++){var A=F[C],B=H[C];var D=Math.max(A.offsetHeight,B.offsetHeight);A.style.height=B.style.height=D+"px"}}},layout:function(B,C){var W=this.grid;var E=W.autoHeight;var L=16;var a=W.getGridEl(),H=this.cm,I=W.autoExpandColumn,O=this;if(!a.dom.offsetWidth){if(B){this.lockedWrap.show();this.mainWrap.show()}return }var V=this.cm.isLocked(0);var F=this.headerPanel.getHeight();var G=this.footerPanel.getHeight();if(E){var K=this.getBodyTable().offsetHeight+F+G+this.mainHd.getHeight();var U=K+a.getBorderWidth("tb");if(W.maxHeight){U=Math.min(W.maxHeight,U)}a.setHeight(U)}if(W.autoWidth){a.setWidth(H.getTotalWidth()+a.getBorderWidth("lr"))}var N=this.scroller;var T=a.getSize(true);this.el.setSize(T.width,T.height);this.headerPanel.setWidth(T.width);this.footerPanel.setWidth(T.width);var M=this.mainHd.getHeight();var Q=T.width;var d=T.height-(F+G);N.setSize(Q,d);var Z=this.getBodyTable();var S=V?Math.max(this.getLockedTable().offsetWidth,this.lockedHd.dom.firstChild.offsetWidth):0;var X=Z.offsetHeight;var J=S+Z.offsetWidth;var b=false,Y=false;this.scrollSizer.setSize(J,X+M);var D=this.lockedWrap,P=this.mainWrap;var R=this.lockedBody,A=this.mainBody;setTimeout(function(){var j=N.dom.offsetTop;var e=N.dom.clientWidth,k=N.dom.clientHeight;D.setTop(j);D.setSize(S,k);P.setLeftTop(S,j);P.setSize(e-S,k);R.setHeight(k-M);A.setHeight(k-M);if(C!==true&&!O.userResized&&I){var i=H.getIndexById(I);var f=H.getTotalWidth(false);var g=H.getColumnWidth(i);var c=Math.min(Math.max(((e-f)+g-2)-(e<=N.dom.offsetWidth?0:18),W.autoExpandMin),W.autoExpandMax);if(g!=c){H.setColumnWidth(i,c,true);O.css.updateRule(O.colSelector+I,"width",(c-O.borderWidth)+"px");O.css.updateRule(O.hdSelector+I,"width",(c-O.borderWidth)+"px");O.updateSplitters();O.layout(false,true)}}if(B){D.show();P.show()}},10)},onWindowResize:function(){if(!this.grid.monitorWindowResize||this.grid.autoHeight){return }this.layout()},appendFooter:function(A){return null},sortAscText:"Sort Ascending",sortDescText:"Sort Descending",lockText:"Lock Column",unlockText:"Unlock Column",columnsText:"Columns"});