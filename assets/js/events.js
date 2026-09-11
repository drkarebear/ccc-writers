(async function () {
  const list=document.querySelector('#event-list'); if(!list)return;
  const broad=document.querySelector('#event-broad-region'),region=document.querySelector('#event-region'),count=document.querySelector('#event-count'),search=document.querySelector('#event-search');
  const upgradeCommunityEventLink=()=>{const link=list.querySelector('[data-community-form-link]');if(!link)return;loadJsonWithFallback('data/site-config.json',window.CCC_SITE_CONFIG).then(config=>{const u=new URL((config.community_form_url||'').trim());if(u.protocol==='https:'&&u.hostname==='docs.google.com')link.href=u.href;}).catch(()=>{});};
  try {
    const events=await loadJsonWithFallback('data/events.json',window.CCC_EVENTS);
    const resetAreas=populateGeographyFilters(broad,region,{broadBlank:'All of California',localBlank:'All local areas'});
    const render=()=>{
      const today=new Date(),b=broad?.value||'',r=region?.value||'',q=normalize(search?.value||'');
      const upcoming=events.filter(e=>{
        const haystack=normalize(`${e.title} ${e.host} ${e.location} ${e.audience||''} ${e.summary||''} ${e.broad_region||''} ${e.region||''} ${e.format||''}`);
        return new Date(`${e.date}T23:59:59`)>=today&&(!b||e.broad_region===b)&&(!r||e.region===r)&&(!q||haystack.includes(q));
      }).sort((a,b)=>a.date.localeCompare(b.date));
      if(count)count.textContent=`${upcoming.length} upcoming event${upcoming.length===1?'':'s'} shown`;
      if(!upcoming.length){list.innerHTML='<div class="empty-state"><h3>No verified upcoming events match.</h3><p>Try another area or search term, or share an event we are missing.</p><a class="button" data-community-form-link href="contribute.html">Share an event</a></div>';upgradeCommunityEventLink();return;}
      list.innerHTML=upcoming.map(event=>{const url=safeHttpsUrl(event.url),title=escapeHTML(event.title);return `<article class="event-card"><div class="meta"><span>${escapeHTML(formatDate(event.date))}</span><span>${escapeHTML(event.format)}</span>${event.region?`<span>${escapeHTML(event.region)}</span>`:''}</div><h3>${title}</h3><p><strong>${escapeHTML(event.host)}</strong></p>${event.time?`<p><strong>Time:</strong> ${escapeHTML(event.time)}</p>`:''}<p><strong>Location:</strong> ${escapeHTML(event.location)}</p>${event.audience?`<p>${escapeHTML(event.audience)}</p>`:''}${event.summary?`<p>${escapeHTML(event.summary)}</p>`:''}${url?`<a class="button secondary" href="${escapeHTML(url)}" aria-label="Event details for ${title}">Event details</a>`:''}</article>`;}).join('');
    };
    broad?.addEventListener('change',()=>{resetAreas();render();});
    region?.addEventListener('change',render);
    search?.addEventListener('input',render);
    render();
  } catch(error){list.innerHTML='<div class="empty-state"><h3>Event data could not load.</h3></div>';console.error(error);}
})();
