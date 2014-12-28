using Raven.Abstractions;
using Raven.Database.Linq;
using System.Linq;
using System.Collections.Generic;
using System.Collections;
using System;
using Raven.Database.Linq.PrivateExtensions;
using Lucene.Net.Documents;
using System.Globalization;
using System.Text.RegularExpressions;
using Raven.Database.Indexing;

public class Index_Items : Raven.Database.Linq.AbstractViewGenerator
{
	public Index_Items()
	{
		this.ViewText = @"from doc in docs.Item
let LastModified = doc[""@metadata""][""Last-Modified""]
select new { Title = doc.Title, LastModified} ";
		this.ForEntityNames.Add("Item");
		this.AddMapDefinition(docs => 
			from doc in ((IEnumerable<dynamic>)docs)
			where string.Equals(doc["@metadata"]["Raven-Entity-Name"], "Item", System.StringComparison.InvariantCultureIgnoreCase)
			let LastModified = doc["@metadata"]["Last-Modified"]
			select new {
				Title = doc.Title,
				LastModified,
				__document_id = doc.__document_id
			});
		this.AddField("Title");
		this.AddField("__document_id");
		this.AddField("LastModified");
		this.AddQueryParameterForMap("Title");
		this.AddQueryParameterForMap("__document_id");
		this.AddQueryParameterForReduce("Title");
		this.AddQueryParameterForReduce("__document_id");
	}
}
