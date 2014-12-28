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

public class Index_Tags : Raven.Database.Linq.AbstractViewGenerator
{
	public Index_Tags()
	{
		this.ViewText = @"from item in docs.Item
from itemTags in item.Tags
select new { Name = itemTags.ToString().ToLower(), Count = 1 }; 
from item in docs.Item
select new { Name = item.Title.ToString().ToLower(), Count = 1 };
 from tagCount in results
group tagCount by tagCount.Name
into g
select new {Name = g.Key, Count = g.Sum(x => x.Count) };";
		this.ForEntityNames.Add("Item");
		this.AddMapDefinition(docs => 
			from item in ((IEnumerable<dynamic>)docs)
			where string.Equals(item["@metadata"]["Raven-Entity-Name"], "Item", System.StringComparison.InvariantCultureIgnoreCase)
			from itemTags in ((IEnumerable<dynamic>)item.Tags)
			select new {
				Name = itemTags.ToString().ToLower(),
				Count = 1,
				__document_id = item.__document_id
			});
		this.ForEntityNames.Add("Item");
		this.AddMapDefinition(docs => 
			from item in ((IEnumerable<dynamic>)docs)
			where string.Equals(item["@metadata"]["Raven-Entity-Name"], "Item", System.StringComparison.InvariantCultureIgnoreCase)
			select new {
				Name = item.Title.ToString().ToLower(),
				Count = 1,
				__document_id = item.__document_id
			});
		this.ReduceDefinition = results => 
			from tagCount in results
			group tagCount by tagCount.Name into g
			select new {
				Name = g.Key,
				Count = g.Sum((Func<dynamic, decimal>)(x => (decimal)(x.Count)))
			};
		this.GroupByExtraction = tagCount => tagCount.Name;
		this.AddField("Name");
		this.AddField("Count");
		this.AddQueryParameterForMap("__document_id");
		this.AddQueryParameterForReduce("__document_id");
	}
}
